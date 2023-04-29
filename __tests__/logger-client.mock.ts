import { setupServer } from 'msw/node'
import { rest } from 'msw'

export const server = setupServer(
  rest.get('http://localhost/loggers', (req, res, ctx) => {
    return res(
      ctx.status(200)
    , ctx.json(['id'])
    )
  })

, rest.get('http://localhost/loggers/:id', (req, res, ctx) => {
    switch (req.params.id) {
      case 'found': {
        return res(
          ctx.status(200)
        , ctx.json({
            limit: 100
          , timeToLive: 200
          })
        )
      }
      default: return res(ctx.status(404))
    }
  })

, rest.put('http://localhost/loggers/:id', async (req, res, ctx) => {
    expect(req.params.id).toBe('id')
    expect(await req.json()).toStrictEqual({
      limit: 100
    , timeToLive: 200
    })

    return res(ctx.status(204))
  })

, rest.delete('http://localhost/loggers/:id', (req, res, ctx) => {
    return res(ctx.status(204))
  })

, rest.post('http://localhost/loggers/:id/log', async (req, res, ctx) => {
    switch (req.params.id) {
      case 'found': {
        expect(await req.json()).toStrictEqual('content')

        return res(ctx.status(204))
      }
      default: return res(ctx.status(404))
    }
  })

, rest.get('http://localhost/loggers/:id/follow', (req, res, ctx) => {
    expect(req.params.id).toBe('id')

    return res(
      ctx.status(200)
    , ctx.set('Connection', 'keep-alive')
    , ctx.set('Content-Type', 'text/event-stream')
    , ctx.body(
        `data: ${JSON.stringify('value')}` + '\n'
      + 'id: 0-0' + '\n'
      + '\n'
      )
    )
  })

, rest.get('http://localhost/loggers/:loggerId/logs/:logIds', (req, res, ctx) => {
    switch (req.params.loggerId) {
      case 'found': {
        expect((req.params.logIds as string).split(',')).toStrictEqual([
          '0-0'
        , '0-1'
        , '1-0'
        ])

        return res(
          ctx.status(200)
        , ctx.json([
            'content-1'
          , null
          , 'content-2'
          ])
        )
      }
      default: return res(ctx.status(404))
    }
  })

, rest.delete('http://localhost/loggers/:loggerId/logs/:logIds', (req, res, ctx) => {
    expect(req.params.loggerId).toBe('id')
    expect((req.params.logIds as string).split(',')).toStrictEqual([
      '0-0'
    , '0-1'
    , '1-0'
    ])

    return res(ctx.status(204))
  })

, rest.get('http://localhost/loggers/:id/logs', (req, res, ctx) => {
    switch (req.params.id) {
      case 'found': {
        expect(req.url.searchParams.get('order')).toBe('asc')

        return res(
          ctx.status(200)
        , ctx.json([
            { id: '0-0', content: 'content' }
          ])
        )
      }
      default: return res(ctx.status(404))
    }
  })

, rest.delete('http://localhost/loggers/:id/logs', (req, res, ctx) => {
    expect(req.params.id).toBe('id')
    expect(req.url.searchParams.get('order')).toBe('asc')

    return res(ctx.status(204))
  })
)
