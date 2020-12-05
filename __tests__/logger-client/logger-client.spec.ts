import { server } from './logger.mock'
import { LoggerClient } from '@src/logger-client'
import { TOKEN } from '@test/utils'
import { toArrayAsync } from 'iterable-operator'
import '@blackglory/jest-matchers'
import 'jest-extended'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
beforeEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('LoggerClient', () => {
  it('write(id: string, val: string, options?: { token?: string }): Promise<void>', async () => {
    const client = createClient()
    const id = 'id'
    const val = 'message'

    const result = client.write(id, val)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })

  it('query(id: string, query: { from?: string; to?: string; head?: number; tail?: number }, options?: { token?: string }): AsyncIterable<Log>', async () => {
    const client = createClient()
    const id = 'id'

    const result = client.query(id, {})
    const proResult = await toArrayAsync(result)

    expect(result).toBeAsyncIterable()
    expect(proResult).toStrictEqual([
      { id: 'id-1', payload: 'payload-1' }
    , { id: 'id-2', payload: 'payload-2' }
    ])
  })

  it('del(id: string, query: { from?: string; to?: string; head?: number; tail?: number }, options?: { token?: string }): Promise<void>', async () => {
    const client = createClient()
    const id = 'id'

    const result = client.del(id, {})
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })
})

function createClient() {
  return new LoggerClient({
    server: 'http://localhost'
  , token: TOKEN
  })
}
