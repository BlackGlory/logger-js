import { go } from '@blackglory/prelude'
import { fetch, EventSource } from 'extra-fetch'
import { post, get, del, IRequestOptionsTransformer, put } from 'extra-request'
import { url, appendPathname, json, searchParam, signal, keepalive, basicAuth, header }
  from 'extra-request/transformers'
import { ok, toJSON } from 'extra-response'
import { Observable } from 'rxjs'
import { assert, CustomError } from '@blackglory/errors'
import { setTimeout } from 'extra-timers'
import { Falsy } from 'justypes'
import { timeoutSignal, raceAbortSignals } from 'extra-abort'
import { expectedVersion } from './utils.js'
import { JSONValue, JSONObject } from 'justypes'
import { NotFound } from '@blackglory/http-status'
import { appendSearchParam } from 'url-operator'

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
  content: JSONValue
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

export interface ILoggerClientObserveOptions {
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
  , content: JSONValue
  , options: ILoggerClientRequestOptions = {}
  ): Promise<void> {
    const req = post(
      ...this.getCommonTransformers(options)
    , appendPathname(`/loggers/${loggerId}/log`)
    , json(content)
    )

    try {
      await fetch(req).then(ok)
    } catch (e) {
      if (e instanceof NotFound) throw new LoggerNotFound()

      throw e
    }
  }

  /**
   * @throws {HeartbeatTimeoutError} from Observable
   */
  follow(
    loggerId: string
  , options: ILoggerClientObserveOptions = {}
  ): Observable<ILog> {
    return new Observable(observer => {
      const url = go(() => {
        let url = new URL(`/loggers/${loggerId}/follow`, this.options.server)
        if (options.since) {
          url = appendSearchParam(url, 'since', options.since)
        }
        return url
      })

      const es = new EventSource(url.href)
      es.addEventListener('message', (evt: MessageEvent) => {
        const log = JSON.parse(evt.data)
        observer.next(log)
      })
      es.addEventListener('error', evt => {
        close()
        observer.error(evt)
      })

      let cancelHeartbeatTimeout: (() => void) | undefined
      if (options.heartbeat ?? this.options.heartbeat) {
        const timeout = (
          options.heartbeat?.timeout ??
          this.options.heartbeat?.timeout
        )!
        assert(Number.isInteger(timeout), 'timeout must be an integer')
        assert(timeout > 0, 'timeout must greater than zero')

        es.addEventListener('open', () => {
          updateTimeout()

          es.addEventListener('heartbeat', updateTimeout)
        })

        function updateTimeout() {
          cancelHeartbeatTimeout?.()
          cancelHeartbeatTimeout = setTimeout(timeout, heartbeatTimeout)
        }
      }

      return close

      function close() {
        cancelHeartbeatTimeout?.()
        es.close()
      }

      function heartbeatTimeout() {
        close()
        observer.error(new HeartbeatTimeoutError())
      }
    })
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

export class HeartbeatTimeoutError extends CustomError {}
export class LoggerNotFound extends CustomError {}
