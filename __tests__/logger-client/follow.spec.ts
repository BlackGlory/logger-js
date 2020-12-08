import { LoggerClient } from '@src/logger-client'
import { Observable } from 'rxjs'
import { TOKEN } from '@test/utils'
import './follow.mock'

jest.mock('eventsource', () => require('mocksse').EventSource)

describe('LoggerClient', () => {
  it('follow(id: string, options?: { token?: string }): Observable<Log>', async done => {
    const id = 'id'
    const client = createClient()

    const observable = client.follow(id)
    observable.subscribe(data => {
      expect(data).toStrictEqual({ id: 'id', payload: 'null' })
      done()
    })

    expect(observable).toBeInstanceOf(Observable)
  })

  it('followJSON(id: string, options?: { token?: string }): Observable<JsonLog>', async done => {
    const id = 'id'
    const client = createClient()

    const observable = client.followJSON(id)
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
