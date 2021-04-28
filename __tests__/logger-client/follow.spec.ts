import { LoggerClient } from '@src/logger-client'
import { Observable } from 'rxjs'
import { TOKEN } from '@test/utils'
import './follow.mock'

jest.mock('eventsource', () => require('mocksse').EventSource)

describe('LoggerClient', () => {
  it(`
    follow(
      namespace: string
    , options?: { token?: string }
    ): Observable<ILog>
  `, async done => {
    const namespace = 'namespace'
    const client = createClient()

    const observable = client.follow(namespace)
    observable.subscribe(data => {
      expect(data).toStrictEqual({ id: 'id', payload: 'null' })
      done()
    })

    expect(observable).toBeInstanceOf(Observable)
  })

  it(`
    followJSON(
      namespace: string
    , options?: { token?: string }
    ): Observable<IJsonLog>
  `, async done => {
    const namespace = 'namespace'
    const client = createClient()

    const observable = client.followJSON(namespace)
    observable.subscribe(data => {
      expect(data).toStrictEqual({ id: 'id', payload: null })
      done()
    })

    expect(observable).toBeInstanceOf(Observable)
  })
})

function createClient() {
  return new LoggerClient({
    server: 'http://localhost'
  , token: TOKEN
  })
}
