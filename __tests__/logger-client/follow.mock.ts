// @ts-ignore
import { MockEvent } from 'mocksse'

new MockEvent({
  url: 'http://localhost/loggers/id/follow'
, responses: [
    {
      type: 'message'
    , lastEventId: '0-0'
    , data: JSON.stringify('value')
    }
  ]
})
