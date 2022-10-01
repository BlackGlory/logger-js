import { server } from './client.mock'
import { LoggerClient } from '@src/client'
import { TOKEN } from '@test/utils'
import '@blackglory/jest-matchers'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
beforeEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('LoggerClient', () => {
  test(`
    write(
      namespace: string
    , val: string
    , options?: { token?: string }
    ): Promise<void>
  `, async () => {
    const client = createClient()
    const namespace = 'namespace'
    const val = 'null'

    const result = client.write(namespace, val)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })

  test(`
    writeJSON(
      namespace: string
    , val: Json
    , options?: { token?: string }
    ): Promise<void>
  `, async () => {
    const client = createClient()
    const namespace = 'namespace'
    const val = null

    const result = client.writeJSON(namespace, val)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })

  it(`
    query(
      namespace: string
    , query: { from?: string; to?: string; head?: number; tail?: number }
    , options?: { token?: string }
    ): Promise<ILog[]>
  `, async () => {
    const client = createClient()
    const namespace = 'namespace'

    const result = client.query(namespace, {})
    const proResult = await result

    expect(proResult).toStrictEqual([
      { id: 'id', payload: 'null' }
    ])
  })

  test(`
    queryJSON(
      namespace: string
    , query: { from?: string; to?: string; head?: number; tail?: number }
    , options?: { token?: string }
    ): Promise<Array<IJsonLog>>
  `, async () => {
    const client = createClient()
    const namespace = 'namespace'

    const result = client.queryJSON(namespace, {})
    const proResult = await result

    expect(proResult).toStrictEqual([
      { id: 'id', payload: null }
    ])
  })

  test(`
    del(
      namespace: string
    , query: { from?: string; to?: string; head?: number; tail?: number }
    , options?: { token?: string }
    ): Promise<void>`, async () => {
    const client = createClient()
    const namespace = 'namespace'

    const result = client.del(namespace, {})
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })

  test('getAllNamespaces(): Promise<string[]>', async () => {
    const client = createClient()

    const result = client.getAllNamespaces()
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toStrictEqual(['namespace'])
  })
})

function createClient() {
  return new LoggerClient({
    server: 'http://localhost'
  , token: TOKEN
  })
}
