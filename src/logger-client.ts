import { go, isntUndefined, pass } from '@blackglory/prelude'
import { fetch } from 'extra-fetch'
import { post, get, del, IRequestOptionsTransformer, put } from 'extra-request'
import { url, appendPathname, json, searchParam, signal, keepalive, basicAuth, header }
  from 'extra-request/transformers'
import { ok, toJSON } from 'extra-response'
import { assert, CustomError } from '@blackglory/errors'
import { setTimeout } from 'extra-timers'
import { Falsy } from 'justypes'
import { timeoutSignal, raceAbortSignals, AbortError } from 'extra-abort'
import { expectedVersion } from './utils.js'
import { JSONValue, JSONObject } from 'justypes'
import { NotFound } from '@blackglory/http-status'
import { fetchEvents } from 'extra-sse'

export type LogId = `${number}-${number}`

export interface IRange {
  order: Order
  from?: LogId
  to?: LogId
  skip?: number
  limit?: number
}

export enum Order {
  Asc = 'asc'
, Desc = 'desc'
}

export interface ILoggerConfig extends JSONObject {
  timeToLive: number | null
  limit: number | null
}

export interface ILog {
  id: LogId
  value: JSONValue
}

export interface ILoggerClientOptions {
  server: string
  basicAuth?: {
    username: string
    password: string
  }
  keepalive?: boolean
  heartbeat?: IHeartbeatOptions
  timeout?: number
}

export interface ILoggerClientRequestOptions {
  signal?: AbortSignal
  keepalive?: boolean
  timeout?: number | false
}

export interface ILoggerClientFollowOptions {
  since?: LogId
  heartbeat?: IHeartbeatOptions
}

export interface IHeartbeatOptions {
  timeout: number
}

export class LoggerClient {
  constructor(private options: ILoggerClientOptions) {}

  async getAllLoggerIds(options: ILoggerClientRequestOptions = {}): Promise<string[]> {
    const req = get(
      ...this.getCommonTransformers(options)
    , appendPathname('/loggers')
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON) as string[]
  }

  async setLogger(
    loggerId: string
  , config: ILoggerConfig
  , options: ILoggerClientRequestOptions = {}
  ): Promise<void> {
    const req = put(
      ...this.getCommonTransformers(options)
    , appendPathname(`/loggers/${loggerId}`)
    , json(config)
    )

    await fetch(req).then(ok)
  }

  async getLogger(
    loggerId: string
  , options: ILoggerClientRequestOptions = {}
  ): Promise<ILoggerConfig | null> {
    const req = get(
      ...this.getCommonTransformers(options)
    , appendPathname(`/loggers/${loggerId}`)
    )

    try {
      return await fetch(req)
        .then(ok)
        .then(toJSON) as ILoggerConfig
    } catch (e) {
      if (e instanceof NotFound) return null

      throw e
    }
  }

  async removeLogger(
    loggerId: string
  , options: ILoggerClientRequestOptions = {}
  ): Promise<void> {
    const req = del(
      ...this.getCommonTransformers(options)
    , appendPathname(`/loggers/${loggerId}`)
    )

    await fetch(req).then(ok)
  }

  async log(
    loggerId: string
  , value: JSONValue
  , options: ILoggerClientRequestOptions = {}
  ): Promise<void> {
    const req = post(
      ...this.getCommonTransformers(options)
    , appendPathname(`/loggers/${loggerId}/log`)
    , json(value)
    )

    try {
      await fetch(req).then(ok)
    } catch (e) {
      if (e instanceof NotFound) throw new LoggerNotFound()

      throw e
    }
  }

  /**
   * @throws {LoggerNotFound}
   */
  async * follow(
    loggerId: string
  , options: ILoggerClientFollowOptions = {}
  ): AsyncIterableIterator<ILog> {
    const heartbeatTimeout = go(() => {
      const timeout = options.heartbeat?.timeout ?? this.options.heartbeat?.timeout
      if (isntUndefined(timeout)) {
        assert(Number.isInteger(timeout), 'heartbeat.timeout must be an integer')
        assert(timeout > 0, 'heartbeat.timeout must greater than zero')
      }

      return timeout
    })
    let cancelHeartbeatTimeout: (() => void) | undefined

    while (true) {
      try {
        const controller = new AbortController()
        for await (
          const { event = 'message', data, id } of fetchEvents(
            () => get(
              url(this.options.server)
            , appendPathname(`/loggers/${loggerId}/follow`)
            , options.since && searchParam('since', options.since)
            , signal(controller.signal)
            )
          , {
              onOpen: () => {
                if (isntUndefined(heartbeatTimeout)) {
                  resetHeartbeatTimeout(controller, heartbeatTimeout)
                }
              }
            }
          )
        ) {
          switch (event) {
            case 'message': {
              if (isntUndefined(data) && isntUndefined(id)) {
                yield {
                  id: id as `${number}-${number}`
                , value: JSON.parse(data)
                }
              }
              break
            }
            case 'heartbeat': {
              if (isntUndefined(heartbeatTimeout)) {
                resetHeartbeatTimeout(controller, heartbeatTimeout)
              }
              break
            }
          }
        }
      } catch (e) {
        if (e instanceof AbortError) {
          pass()
        } else if (e instanceof NotFound) {
          throw new LoggerNotFound()
        } else {
          throw e
        }
      } finally {
        cancelHeartbeatTimeout?.()
      }
    }

    function resetHeartbeatTimeout(controller: AbortController, timeout: number): void {
      cancelHeartbeatTimeout?.()
      cancelHeartbeatTimeout = setTimeout(timeout, () => controller.abort())
    }
  }

  /**
   * @throws {LoggerNotFound}
   */
  async getLogs(
    loggerId: string
  , logIds: LogId[]
  , options: ILoggerClientRequestOptions = {}
  ): Promise<Array<JSONValue | null>> {
    const req = get(
      ...this.getCommonTransformers(options)
    , appendPathname(`/loggers/${loggerId}/logs/${logIds.join(',')}`)
    )

    try {
      return await fetch(req)
        .then(ok)
        .then(toJSON) as Array<JSONValue | null>
    } catch (e) {
      if (e instanceof NotFound) throw new LoggerNotFound()

      throw e
    }
  }

  async removeLogs(
    loggerId: string
  , logIds: LogId[]
  , options: ILoggerClientRequestOptions = {}
  ): Promise<void> {
    const req = del(
      ...this.getCommonTransformers(options)
    , appendPathname(`/loggers/${loggerId}/logs/${logIds.join(',')}`)
    )

    await fetch(req).then(ok)
  }

  /**
   * @throws {LoggerNotFound}
   */
  async queryLogs(
    loggerId: string
  , range: IRange
  , options: ILoggerClientRequestOptions = {}
  ): Promise<ILog[]> {
    const req = get(
      ...this.getCommonTransformers(options)
    , appendPathname(`/loggers/${loggerId}/logs`)
    , range.order && searchParam('order', range.order)
    , range.from && searchParam('from', range.from)
    , range.to && searchParam('to', range.to)
    , range.skip && searchParam('tail', range.skip)
    , range.limit && searchParam('tail', range.limit)
    )

    try {
      return await fetch(req)
        .then(ok)
        .then(toJSON) as ILog[]
    } catch (e) {
      if (e instanceof NotFound) throw new LoggerNotFound()

      throw e
    }
  }

  async clearLogs(
    loggerId: string
  , range: IRange
  , options: ILoggerClientRequestOptions = {}
  ): Promise<void> {
    const req = del(
      ...this.getCommonTransformers(options)
    , appendPathname(`/loggers/${loggerId}/logs`)
    , range.order && searchParam('order', range.order)
    , range.from && searchParam('from', range.from)
    , range.to && searchParam('to', range.to)
    , range.skip && searchParam('tail', range.skip)
    , range.limit && searchParam('tail', range.limit)
    )

    await fetch(req).then(ok)
  }

  private getCommonTransformers(
    options: ILoggerClientRequestOptions
  ): Array<IRequestOptionsTransformer | Falsy> {
    const auth = this.options.basicAuth

    return [
      url(this.options.server)
    , auth && basicAuth(auth.username, auth.password)
    , signal(raceAbortSignals([
        options.signal
      , options.timeout !== false && (
          (options.timeout && timeoutSignal(options.timeout)) ??
          (this.options.timeout && timeoutSignal(this.options.timeout))
        )
      ]))
    , (options.keepalive ?? this.options.keepalive) && keepalive()
    , header('Accept-Version', expectedVersion)
    ]
  }
}

export class LoggerNotFound extends CustomError {}
