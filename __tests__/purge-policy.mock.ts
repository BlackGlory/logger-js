import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { badAuth, badJson } from '@test/utils'

export const server = setupServer(
  rest.get('/admin/logger-with-purge-policies', (req, res, ctx) => {
    if (badAuth(req)) return res(ctx.status(401))

    return res(
      ctx.status(200)
    , ctx.json(['id'])
    )
  })

, rest.get('/admin/logger/:id/purge-policies', (req, res, ctx) => {
    if (badAuth(req)) return res(ctx.status(401))

    return res(
      ctx.status(200)
    , ctx.json({
        timeToLive: 100
      , limit: 200
      })
    )
  })

, rest.put('/admin/logger/:id/purge-policies/time-to-live', (req, res, ctx) => {
    if (badAuth(req)) return res(ctx.status(401))
    if (badJson(req)) return res(ctx.status(400))

    return res(ctx.status(204))
  })

, rest.delete('/admin/logger/:id/purge-policies/time-to-live', (req, res, ctx) => {
    if (badAuth(req)) return res(ctx.status(401))

    return res(ctx.status(204))
  })

, rest.put('/admin/logger/:id/purge-policies/limit', (req, res, ctx) => {
    if (badAuth(req)) return res(ctx.status(401))
    if (badJson(req)) return res(ctx.status(400))

    return res(ctx.status(204))
  })

, rest.delete('/admin/logger/:id/purge-policies/limit', (req, res, ctx) => {
    if (badAuth(req)) return res(ctx.status(401))

    return res(ctx.status(204))
  })

, rest.post('/admin/logger/:id/purge-policies', (req, res, ctx) => {
    if (badAuth(req)) return res(ctx.status(401))

    return res(ctx.status(204))
  })
)
