import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { badAuth } from '@test/utils.js'

export const server = setupServer(
  rest.get('http://localhost/admin/whitelist', (req, res, ctx) => {
    if (badAuth(req)) return res(ctx.status(401))

    return res(
      ctx.status(200)
    , ctx.json(['namespace'])
    )
  })

, rest.put('http://localhost/admin/whitelist/:namespace', (req, res, ctx) => {
    if (badAuth(req)) return res(ctx.status(401))

    return res(ctx.status(204))
  })

, rest.delete('http://localhost/admin/whitelist/:namespace', (req, res, ctx) => {
    if (badAuth(req)) return res(ctx.status(401))

    return res(ctx.status(204))
  })
)
