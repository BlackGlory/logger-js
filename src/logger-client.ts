import { fetch } from 'cross-fetch'
import { post, get, del } from 'extra-request'
import { url, pathname, text, searchParam } from 'extra-request/lib/es2018/transformers'
import { checkHTTPStatus, toJSON } from './utils'
import { Observable } from 'rxjs'
import EventSource = require('eventsource')

interface Query {
  from?: string
  to?: string
  head?: number
  tail?: number
}

interface Log {
  id: string
  payload: string
}

export interface LoggerClientOptions {
  server: string
  token?: string
}

export class LoggerClient {
  constructor(private options: LoggerClientOptions) {}

  async write(
    id: string
  , val: string
  , options: { token?: string } = {}
  ): Promise<void> {
    const token = options.token ?? this.options.token
    const req = post(
      url(this.options.server)
    , pathname(`/logger/${id}`)
    , token && searchParam('token', token)
    , text(val)
    )

    await fetch(req)
      .then(checkHTTPStatus)
  }

  follow(id: string, options: { token?: string } = {}): Observable<Log> {
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

  async* query(
    id: string
  , query: Query
  , options: { token?: string } = {}
  ): AsyncIterable<Log> {
    const token = options.token ?? this.options.token
    const req = get(
      url(this.options.server)
    , pathname(`/logger/${id}/logs`)
    , query.from && searchParam('from', query.from)
    , query.to && searchParam('to', query.to)
    , query.head && searchParam('head', query.head.toString())
    , query.tail && searchParam('tail', query.tail.toString())
    , token && searchParam('token', token)
    )

    yield* await fetch(req)
      .then(checkHTTPStatus)
      .then(toJSON) as AsyncIterable<Log>
  }

  async del(
    id: string
  , query: Query
  , options: { token?: string } = {}
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

    await fetch(req)
      .then(checkHTTPStatus)
  }
}
