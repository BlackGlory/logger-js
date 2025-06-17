import { fastify } from 'fastify'
import { stringifyEvent } from 'extra-sse'
import { toArray } from '@blackglory/prelude'
import { concat } from 'iterable-operator'

export function buildServer() {
  const server = fastify()

  server.get('/loggers', () => {
    return Response.json(['id'], { status: 200 })
  })

  server.get<{
    Params: {
      id: string
    }
  }>('/loggers/:id', req => {
    switch (req.params.id) {
      case 'found': {
        return Response.json(
          {
            limit: 100
          , timeToLive: 200
          }
        , { status: 200 }
        )
      }
      default: return new Response('', { status: 404 })
    }
  })

  server.put<{
    Params: {
      id: string
    }
    Body: {
      limit: number
      timeToLive: number
    }
  }>('/loggers/:id', req => {
    expect(req.params.id).toBe('id')
    expect(req.body).toStrictEqual({
      limit: 100
    , timeToLive: 200
    })

    return new Response(null, { status: 204 })
  })

  server.delete('/loggers/:id', () => {
    return new Response(null, { status: 204 })
  })

  server.post<{
    Params: {
      id: string
    }
    Body: string
  }>('/loggers/:id/log', req => {
    switch (req.params.id) {
      case 'found': {
        expect(req.body).toStrictEqual('content')

        return new Response(null, { status: 204 })
      }
      default: return new Response('', { status: 404 })
    }
  })

  server.get<{
    Params: {
      id: string
    }
  }>('/loggers/:id/follow', req => {
    switch (req.params.id) {
      case 'found': {
        return new Response(
          toArray(concat(
            stringifyEvent({
              id: '0-0'
            , data: JSON.stringify('value')
            })
          , stringifyEvent({ event: 'heartbeat' })
          )).join('')
        , {
            status: 200
          , headers: {
              'Connection': 'keep-alive'
            , 'Content-Type': 'text/event-stream'
            }
          }
        )
      }
      default: return new Response('', { status: 404 })
    }
  })

  server.get<{
    Params: {
      loggerId: string
      logIds: string
    }
  }>('/loggers/:loggerId/logs/:logIds', req => {
    switch (req.params.loggerId) {
      case 'found': {
        expect((req.params.logIds).split(',')).toStrictEqual([
          '0-0'
        , '0-1'
        , '1-0'
        ])

        return Response.json(
          [
            'content-1'
          , null
          , 'content-2'
          ]
        , { status: 200 }
        )
      }
      default: return new Response('', { status: 404 })
    }
  })

  server.delete<{
    Params: {
      loggerId: string
      logIds: string
    }
  }>('/loggers/:loggerId/logs/:logIds', req => {
    expect(req.params.loggerId).toBe('id')
    expect((req.params.logIds).split(',')).toStrictEqual([
      '0-0'
    , '0-1'
    , '1-0'
    ])

    return new Response(null, { status: 204 })
  })

  server.get<{
    Params: {
      id: string
    }
    Querystring: {
      order: string
    }
  }>('/loggers/:id/logs', req => {
    switch (req.params.id) {
      case 'found': {
        expect(req.query.order).toBe('asc')

        return Response.json(
          [
            { id: '0-0', content: 'content' }
          ]
        , { status: 200 }
        )
      }
      default: return new Response('', { status: 404 })
    }
  })

  server.delete<{
    Params: {
      id: string
    }
    Querystring: {
      order: string
    }
  }>('/loggers/:id/logs', req => {
    expect(req.params.id).toBe('id')
    expect(req.query.order).toBe('asc')

    return new Response(null, { status: 204 })
  })

  return server
}
