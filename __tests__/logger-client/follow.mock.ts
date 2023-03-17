// @ts-ignore
import { MockEvent } from 'mocksse'

new MockEvent({
  url: 'http://localhost/loggers/id/follow'
, responses: [
    {
      type: 'message', data: JSON.stringify({ id: '0-0', content: 'content' })
    }
  ]
})
