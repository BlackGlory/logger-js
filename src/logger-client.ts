import { fetch } from 'extra-fetch'
import { post, get, del } from 'extra-request'
import { url, pathname, text, searchParam, signal } from 'extra-request/lib/es2018/transformers'
import { ok, toJSON } from 'extra-response'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import 'eventsource/lib/eventsource-polyfill'

interface Query {
  from?: string
  to?: string
  head?: number
  tail?: number
}

export interface Log {
  id: string
  payload: string
}

export interface JsonLog<T> {
  id: string
  payload: T
}

export interface LoggerClientOptions {
  server: string
  token?: string
}

export interface LoggerClientRequestOptions {
  signal?: AbortSignal
  token?: string
}

export interface LoggerClientRequestOptionsWithoutToken {
  signal?: AbortSignal
}

export interface LoggerClientObserveOptions {
  token?: string
}

export class LoggerClient {
  constructor(private options: LoggerClientOptions) {}

  async write(
    id: string
  , val: string
  , options: LoggerClientRequestOptions = {}
  ): Promise<void> {
    const token = options.token ?? this.options.token
    const req = post(
      url(this.options.server)
    , pathname(`/logger/${id}`)
    , token && searchParam('token', token)
    , text(val)
    , options.signal && signal(options.signal)
    )

    await fetch(req).then(ok)
  }

  async writeJSON<T>(
    id: string
  , val: T
  , options?: LoggerClientRequestOptions
  ): Promise<void> {
    return await this.write(id, JSON.stringify(val), options)
  }

  follow(id: string, options: LoggerClientObserveOptions = {}): Observable<Log> {
    return new Observable(observer => {
      const token = options.token ?? this.options.token
      const url = new URL(`/logger/${id}`, this.options.server)
      if (token) url.searchParams.append('token', token)

      const es = new EventSource(url.href)
      es.addEventListener('message', (evt: MessageEvent) => {
        const log = JSON.parse(evt.data)
        observer.next(log)
      })
      es.addEventListener('error', (evt: MessageEvent) => observer.error(evt))

      return () => es.close()
    })
  }

  followJSON<T>(id: string, options?: LoggerClientObserveOptions): Observable<JsonLog<T>> {
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
  , query: Query
  , options: LoggerClientRequestOptions = {}
  ): Promise<Log[]> {
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
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON) as Log[]
  }

  async queryJSON<T>(
    id: string
  , query: Query
  , options?: LoggerClientRequestOptions
  ): Promise<Array<JsonLog<T>>> {
    const logs = await this.query(id, query, options)
    return logs.map<JsonLog<T>>(x => ({
      id: x.id
    , payload: JSON.parse(x.payload)
    }))
  }

  async del(
    id: string
  , query: Query
  , options: LoggerClientRequestOptions = {}
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
    )

    await fetch(req).then(ok)
  }

  async list(options: LoggerClientRequestOptionsWithoutToken = {}): Promise<string[]> {
    const req = get(
      url(this.options.server)
    , pathname('/logger')
    , options.signal && signal(options.signal)
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON) as string[]
  }
}
