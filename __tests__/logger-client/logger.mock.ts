import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { badText, badToken } from '@test/utils'

export const server = setupServer(
  rest.post('/logger/:id', (req, res, ctx) => {
    if (badToken(req)) return res(ctx.status(401))
    if (badText(req)) return res(ctx.status(400))

    return res(ctx.status(204))
  })

, rest.get('/logger/:id/logs', (req, res, ctx) => {
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

, rest.delete('/logger/:id/logs', (req, res, ctx) => {
    if (badToken(req)) return res(ctx.status(401))

    return res(ctx.status(204))
  })
)
