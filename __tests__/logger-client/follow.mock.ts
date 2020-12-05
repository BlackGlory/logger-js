import { MockEvent } from 'mocksse'
import { TOKEN } from '@test/utils'

const id = 'id'
new MockEvent({
  url: `http://localhost/logger/${id}?token=${TOKEN}`
, responses: [
    { type: 'message', data: JSON.stringify({ id: 'id', payload: 'payload' }) }
  ]
})
