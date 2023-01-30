import { IJSONLog, ILog, LoggerClient } from '@src/client.js'
import { Observable } from 'rxjs'
import { TOKEN } from '@test/utils.js'
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
    const namespace = 'namespace'
    const client = createClient()

    const observable = client.follow(namespace)
    const data = await new Promise<ILog>(resolve => {
      observable.subscribe(resolve)
    })

    expect(observable).toBeInstanceOf(Observable)
    expect(data).toStrictEqual({ id: 'id', payload: 'null' })
  })

  test('followJSON', async () => {
    const namespace = 'namespace'
    const client = createClient()

    const observable = client.followJSON(namespace)
    const data = await new Promise<IJSONLog<unknown>>(resolve => {
      observable.subscribe(resolve)
    })

    expect(data).toStrictEqual({ id: 'id', payload: null })
    expect(observable).toBeInstanceOf(Observable)
  })
})

function createClient() {
  return new LoggerClient({
    server: 'http://localhost'
  , token: TOKEN
  })
}
