import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { badText, badToken } from '@test/utils.js'

export const server = setupServer(
  rest.post('http://localhost/logger/:namespace', (req, res, ctx) => {
    if (badToken(req)) return res(ctx.status(401))
    if (badText(req)) return res(ctx.status(400))

    return res(ctx.status(204))
  })

, rest.get('http://localhost/logger/:namespace/logs', (req, res, ctx) => {
    if (badToken(req)) return res(ctx.status(401))

    const result = [
      { id: 'id', payload: 'null' }
    ]
    if (req.headers.get('Accept') === 'application/x-ndjson') {
      return res(
        ctx.status(200)
      , ctx.text(result.map(x => JSON.stringify(x)).join('\n'))
      , ctx.set('Content-Type', 'application/x-ndjson')
      )
    } else {
      return res(
        ctx.status(200)
      , ctx.json(result)
      )
    }
  })

, rest.delete('http://localhost/logger/:namespace/logs', (req, res, ctx) => {
    if (badToken(req)) return res(ctx.status(401))

    return res(ctx.status(204))
  })

, rest.get('http://localhost/logger', (req, res, ctx) => {
    return res(
      ctx.status(200)
    , ctx.json(['namespace'])
    )
  })
)
