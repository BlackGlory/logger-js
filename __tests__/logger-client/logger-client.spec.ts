import { server } from './logger.mock'
import { LoggerClient } from '@src/logger-client'
import { TOKEN } from '@test/utils'
import '@blackglory/jest-matchers'
import 'jest-extended'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
beforeEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('LoggerClient', () => {
  it('write(id: string, val: string, options?: { token?: string }): Promise<void>', async () => {
    const client = createClient()
    const id = 'id'
    const val = 'null'

    const result = client.write(id, val)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })

  it('writeJSON(id: string, val: Json, options?: { token?: string }): Promise<void>', async () => {
    const client = createClient()
    const id = 'id'
    const val = null

    const result = client.writeJSON(id, val)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })

  it('query(id: string, query: { from?: string; to?: string; head?: number; tail?: number }, options?: { token?: string }): Promise<Log[]>', async () => {
    const client = createClient()
    const id = 'id'

    const result = client.query(id, {})
    const proResult = await result

    expect(proResult).toStrictEqual([
      { id: 'id', payload: 'null' }
    ])
  })

  it('queryJSON(id: string, query: { from?: string; to?: string; head?: number; tail?: number }, options?: { token?: string }): Promise<Array<JsonLog>>', async () => {
    const client = createClient()
    const id = 'id'

    const result = client.queryJSON(id, {})
    const proResult = await result

    expect(proResult).toStrictEqual([
      { id: 'id', payload: null }
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

  it('list(): Promise<string[]>', async () => {
    const client = createClient()

    const result = client.list()
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toStrictEqual(['id'])
  })
})

function createClient() {
  return new LoggerClient({
    server: 'http://localhost'
  , token: TOKEN
  })
}
