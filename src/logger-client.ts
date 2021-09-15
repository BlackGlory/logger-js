import { fetch, EventSource } from 'extra-fetch'
import { post, get, del, IHTTPOptionsTransformer } from 'extra-request'
import { url, pathname, text, searchParam, searchParams, signal, keepalive }
  from 'extra-request/lib/es2018/transformers'
import { ok, toJSON } from 'extra-response'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { assert, CustomError } from '@blackglory/errors'
import { setTimeout } from 'extra-timers'
import { Falsy } from 'justypes'
import { timeoutSignal, raceAbortSignals } from 'extra-promise'

export { HTTPClientError } from '@blackglory/http-status'

interface IQuery {
  from?: string
  to?: string
  head?: number
  tail?: number
}

export interface ILog {
  id: string
  payload: string
}

export interface IJsonLog<T> {
  id: string
  payload: T
}

export interface ILoggerClientOptions {
  server: string
  token?: string
  keepalive?: boolean
  heartbeat?: IHeartbeatOptions
  timeout?: number
}

export interface ILoggerClientRequestOptions {
  signal?: AbortSignal
  token?: string
  keepalive?: boolean
  timeout?: number | false
}

export interface ILoggerClientRequestOptionsWithoutToken {
  signal?: AbortSignal
  keepalive?: boolean
  timeout?: number | false
}

export interface ILoggerClientObserveOptions {
  token?: string
  heartbeat?: IHeartbeatOptions
}

export interface IHeartbeatOptions {
  timeout: number
}

export class LoggerClient {
  constructor(private options: ILoggerClientOptions) {}

  private getCommonTransformers(
    options: ILoggerClientRequestOptions | ILoggerClientRequestOptionsWithoutToken
  ): Array<IHTTPOptionsTransformer | Falsy> {
    const token = 'token' in options
                  ? (options.token ?? this.options.token)
                  : this.options.token

    return [
      url(this.options.server)
    , token && searchParams({ token })
    , signal(raceAbortSignals([
        options.signal
      , options.timeout !== false && (
          (options.timeout && timeoutSignal(options.timeout)) ??
          (this.options.timeout && timeoutSignal(this.options.timeout))
        )
      ]))
    , keepalive(options.keepalive ?? this.options.keepalive)
    ]
  }

  async write(
    namespace: string
  , val: string
  , options: ILoggerClientRequestOptions = {}
  ): Promise<void> {
    const req = post(
      ...this.getCommonTransformers(options)
    , pathname(`/logger/${namespace}`)
    , text(val)
    )

    await fetch(req).then(ok)
  }

  async writeJSON<T>(
    namespace: string
  , val: T
  , options?: ILoggerClientRequestOptions
  ): Promise<void> {
    return await this.write(namespace, JSON.stringify(val), options)
  }

  /**
   * @throws {HeartbeatTimeoutError} from Observable
   */
  follow(
    namespace: string
  , options: ILoggerClientObserveOptions = {}
  ): Observable<ILog> {
    return new Observable(observer => {
      const token = options.token ?? this.options.token
      const url = new URL(`/logger/${namespace}`, this.options.server)
      if (token) url.searchParams.append('token', token)

      const es = new EventSource(url.href)
      es.addEventListener('message', (evt: MessageEvent) => {
        const log = JSON.parse(evt.data)
        observer.next(log)
      })
      es.addEventListener('error', evt => {
        close()
        observer.error(evt)
      })

      let cancelHeartbeatTimeout: (() => void) | null = null
      if (options.heartbeat ?? this.options.heartbeat) {
        const timeout = options.heartbeat.timeout ?? this.options.heartbeat.timeout
        assert(Number.isInteger(timeout), 'timeout must be an integer')
        assert(timeout > 0, 'timeout must greater than zero')

        es.addEventListener('open', () => {
          updateTimeout()

          es.addEventListener('heartbeat', updateTimeout)
        })

        function updateTimeout() {
          if (cancelHeartbeatTimeout) cancelHeartbeatTimeout()
          cancelHeartbeatTimeout = setTimeout(timeout, heartbeatTimeout)
        }
      }

      return close

      function close() {
        if (cancelHeartbeatTimeout) cancelHeartbeatTimeout()
        es.close()
      }

      function heartbeatTimeout() {
        close()
        observer.error(new HeartbeatTimeoutError())
      }
    })
  }

  /**
   * @throws {HeartbeatTimeoutError} from Observable
   */
  followJSON<T>(
    namespace: string
  , options?: ILoggerClientObserveOptions
  ): Observable<IJsonLog<T>> {
    return this.follow(namespace, options).pipe(
      map(x => {
        return {
          id: x.id
        , payload: JSON.parse(x.payload)
        }
      })
    )
  }

  async query(
    namespace: string
  , query: IQuery
  , options: ILoggerClientRequestOptions = {}
  ): Promise<ILog[]> {
    const req = get(
      ...this.getCommonTransformers(options)
    , pathname(`/logger/${namespace}/logs`)
    , query.from && searchParam('from', query.from)
    , query.to && searchParam('to', query.to)
    , query.head && searchParam('head', query.head.toString())
    , query.tail && searchParam('tail', query.tail.toString())
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON) as ILog[]
  }

  async queryJSON<T>(
    id: string
  , query: IQuery
  , options?: ILoggerClientRequestOptions
  ): Promise<Array<IJsonLog<T>>> {
    const logs = await this.query(id, query, options)
    return logs.map<IJsonLog<T>>(x => ({
      id: x.id
    , payload: JSON.parse(x.payload)
    }))
  }

  async del(
    id: string
  , query: IQuery
  , options: ILoggerClientRequestOptions = {}
  ): Promise<void> {
    const req = del(
      ...this.getCommonTransformers(options)
    , pathname(`/logger/${id}/logs`)
    , query.from && searchParam('from', query.from)
    , query.to && searchParam('to', query.to)
    , query.head && searchParam('head', query.head.toString())
    , query.tail && searchParam('tail', query.tail.toString())
    )

    await fetch(req).then(ok)
  }

  async getAllNamespaces(
    options: ILoggerClientRequestOptionsWithoutToken = {}
  ): Promise<string[]> {
    const req = get(
      ...this.getCommonTransformers(options)
    , pathname('/logger')
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON) as string[]
  }
}

export class HeartbeatTimeoutError extends CustomError {}
