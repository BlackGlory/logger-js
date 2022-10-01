import { LoggerClient } from '@src/client'
import { Observable } from 'rxjs'
import { TOKEN } from '@test/utils'
import './follow.mock'
import { go } from '@blackglory/go'

jest.mock('eventsource', () => require('mocksse').EventSource)

describe('LoggerClient', () => {
  test(`
    follow(
      namespace: string
    , options?: { token?: string }
    ): Observable<ILog>
  `, done => {
    go(async () => {
      const namespace = 'namespace'
      const client = createClient()

      const observable = client.follow(namespace)
      observable.subscribe(data => {
        expect(data).toStrictEqual({ id: 'id', payload: 'null' })
        done()
      })

      expect(observable).toBeInstanceOf(Observable)
    })
  })

  test(`
    followJSON(
      namespace: string
    , options?: { token?: string }
    ): Observable<IJsonLog>
  `, done => {
    go(async () => {
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
})

function createClient() {
  return new LoggerClient({
    server: 'http://localhost'
  , token: TOKEN
  })
}
