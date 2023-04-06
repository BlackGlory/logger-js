import { ILog, LoggerClient } from '@src/logger-client.js'
import { Observable } from 'rxjs'
import './follow.mock'

vi.mock('extra-fetch', () => {
  const actual = vi.importActual('extra-fetch')
  const EventSource = require('mocksse').EventSource
  return {
    ...actual
  , EventSource
  }
})

describe('LoggerClient', () => {
  test('follow', async () => {
    const client = createClient()

    const observable = client.follow('id')
    const log = await new Promise<ILog>(resolve => observable.subscribe(resolve))

    expect(observable).toBeInstanceOf(Observable)
    expect(log).toStrictEqual({ id: '0-0', value: 'value' })
  })
})

function createClient() {
  return new LoggerClient({ server: 'http://localhost' })
}
