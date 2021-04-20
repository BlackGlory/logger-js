import { fetch, EventSource } from 'extra-fetch'
import { post, get, del } from 'extra-request'
import { url, pathname, text, searchParam, signal, keepalive } from 'extra-request/lib/es2018/transformers'
import { ok, toJSON } from 'extra-response'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { assert, CustomError } from '@blackglory/errors'
import { setDynamicTimeoutLoop } from 'extra-timers'

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
}

export interface ILoggerClientRequestOptions {
  signal?: AbortSignal
  token?: string
  keepalive?: boolean
}

export interface ILoggerClientRequestOptionsWithoutToken {
  signal?: AbortSignal
  keepalive?: boolean
}

export interface ILoggerClientObserveOptions {
  token?: string
  heartbeat?: IHeartbeatOptions
}

export interface IHeartbeatOptions {
  timeout: number
  probes: number // probe count
}

export class LoggerClient {
  constructor(private options: ILoggerClientOptions) {}

  async write(
    id: string
  , val: string
  , options: ILoggerClientRequestOptions = {}
  ): Promise<void> {
    const token = options.token ?? this.options.token
    const req = post(
      url(this.options.server)
    , pathname(`/logger/${id}`)
    , token && searchParam('token', token)
    , text(val)
    , options.signal && signal(options.signal)
    , keepalive(options.keepalive ?? this.options.keepalive)
    )

    await fetch(req).then(ok)
  }

  async writeJSON<T>(
    id: string
  , val: T
  , options?: ILoggerClientRequestOptions
  ): Promise<void> {
    return await this.write(id, JSON.stringify(val), options)
  }

  follow(id: string, options: ILoggerClientObserveOptions = {}): Observable<ILog> {
    return new Observable(observer => {
      const token = options.token ?? this.options.token
      const url = new URL(`/logger/${id}`, this.options.server)
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

      let cancelHeartbeatTimer: (() => void) | null = null
      if (options.heartbeat ?? this.options.heartbeat) {
        const timeout = options.heartbeat.timeout ?? this.options.heartbeat.timeout
        assert(Number.isInteger(timeout), 'timeout must be an integer')
        assert(timeout > 0, 'timeout must greater than zero')

        const probes = options.heartbeat.probes ?? this.options.heartbeat.probes
        assert(Number.isInteger(probes), 'probes must be an integer')
        assert(probes >= 0, 'probes must greater than or equal to zero')

        let lastHeartbeat = Date.now()
        cancelHeartbeatTimer = setDynamicTimeoutLoop(timeout, () => {
          if (Date.now() - lastHeartbeat > timeout * (probes + 1)) {
            close()
            observer.error(new HeartbeatTimeoutError())
          }
        })

        es.addEventListener('heartbeat', () => {
          lastHeartbeat = Date.now()
        })
      }

      return close

      function close() {
        if (cancelHeartbeatTimer) cancelHeartbeatTimer()
        es.close()
      }
    })
  }

  followJSON<T>(id: string, options?: ILoggerClientObserveOptions): Observable<IJsonLog<T>> {
    return this.follow(id, options).pipe(
      map(x => {
        return {
          id: x.id
        , payload: JSON.parse(x.payload)
        }
      })
    )
  }

  async query(
    id: string
  , query: IQuery
  , options: ILoggerClientRequestOptions = {}
  ): Promise<ILog[]> {
    const token = options.token ?? this.options.token
    const req = get(
      url(this.options.server)
    , pathname(`/logger/${id}/logs`)
    , query.from && searchParam('from', query.from)
    , query.to && searchParam('to', query.to)
    , query.head && searchParam('head', query.head.toString())
    , query.tail && searchParam('tail', query.tail.toString())
    , token && searchParam('token', token)
    , options.signal && signal(options.signal)
    , keepalive(options.keepalive ?? this.options.keepalive)
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
    const token = options.token ?? this.options.token
    const req = del(
      url(this.options.server)
    , pathname(`/logger/${id}/logs`)
    , query.from && searchParam('from', query.from)
    , query.to && searchParam('to', query.to)
    , query.head && searchParam('head', query.head.toString())
    , query.tail && searchParam('tail', query.tail.toString())
    , token && searchParam('token', token)
    , keepalive(options.keepalive ?? this.options.keepalive)
    )

    await fetch(req).then(ok)
  }

  async getAllLoggerIds(options: ILoggerClientRequestOptionsWithoutToken = {}): Promise<string[]> {
    const req = get(
      url(this.options.server)
    , pathname('/logger')
    , options.signal && signal(options.signal)
    , keepalive(options.keepalive ?? this.options.keepalive)
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON) as string[]
  }
}

export class HeartbeatTimeoutError extends CustomError {}
