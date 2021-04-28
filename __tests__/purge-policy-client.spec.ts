import { server } from '@test/purge-policy.mock'
import { PurgePolicyClient } from '@src/purge-policy-client'
import { ADMIN_PASSWORD } from '@test/utils'
import '@blackglory/jest-matchers'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
beforeEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('PurgePolicyClient', () => {
  test('getNamespaces(): Promise<string[]>', async () => {
    const client = createClient()

    const result = client.getNamespaces()
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toStrictEqual(['namespace'])
  })

  test('get(namespace: string): Promise<{ timeToLive: number | null; limit: number | null }>', async () => {
    const client = createClient()
    const namespace = 'namespace'

    const result = client.get(namespace)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toStrictEqual({
      timeToLive: 100
    , limit: 200
    })
  })

  test('setTimeToLive(namespace: string, val: number): Promise<void>', async () => {
    const client = createClient()
    const namespace = 'namespace'
    const val = 100

    const result = client.setTimeToLive(namespace, val)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })

  test('removeTimeToLive(namespace: string): Promise<void>', async () => {
    const client = createClient()
    const namespace = 'namespace'

    const result = client.removeTimeToLive(namespace)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })

  test('setLimit(namespace: string, val: number): Promise<void>', async () => {
    const client = createClient()
    const namespace = 'namespace'
    const val = 100

    const result = client.setLimit(namespace, val)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })

  test('removeLimit(namespace: string): Promise<void>', async () => {
    const client = createClient()
    const namespace = 'namespace'

    const result = client.removeLimit(namespace)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })

  test('purge(namespace: string): Promise<void>', async () => {
    const client = createClient()
    const namespace = 'namespace'

    const result = client.purge(namespace)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })
})

function createClient() {
  return new PurgePolicyClient({
    server: 'http://localhost'
  , adminPassword: ADMIN_PASSWORD
  })
}
