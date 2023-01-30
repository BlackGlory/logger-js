// @ts-ignore
import { MockEvent } from 'mocksse'
import { TOKEN } from '@test/utils.js'

const namespace = 'namespace'
new MockEvent({
  url: `http://localhost/logger/${namespace}?token=${TOKEN}`
, responses: [
    {
      type: 'message', data: JSON.stringify({ id: 'id', payload: 'null' })
    }
  ]
})
