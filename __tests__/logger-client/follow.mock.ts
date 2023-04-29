import { setupServer } from 'msw/node'
import { rest } from 'msw'

export const server = setupServer(
  rest.get('http://localhost/loggers/:id/follow', (req, res, ctx) => {
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
)
