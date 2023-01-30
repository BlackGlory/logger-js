import { server } from './purge-policy-manager.mock.js'
import { PurgePolicyManager } from '@manager/purge-policy-manager.js'
import { ADMIN_PASSWORD } from '@test/utils.js'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
beforeEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('PurgePolicyManager', () => {
  test('getNamespaces(): Promise<string[]>', async () => {
    const client = createManager()

    const result = await client.getNamespaces()

    expect(result).toStrictEqual(['namespace'])
  })

  test('get(namespace: string): Promise<{ timeToLive: number | null; limit: number | null }>', async () => {
    const client = createManager()
    const namespace = 'namespace'

    const result = await client.get(namespace)

    expect(result).toStrictEqual({
      timeToLive: 100
    , limit: 200
    })
  })

  test('setTimeToLive(namespace: string, val: number): Promise<void>', async () => {
    const client = createManager()
    const namespace = 'namespace'
    const val = 100

    const result = await client.setTimeToLive(namespace, val)

    expect(result).toBeUndefined()
  })

  test('removeTimeToLive(namespace: string): Promise<void>', async () => {
    const client = createManager()
    const namespace = 'namespace'

    const result = await client.removeTimeToLive(namespace)

    expect(result).toBeUndefined()
  })

  test('setLimit(namespace: string, val: number): Promise<void>', async () => {
    const client = createManager()
    const namespace = 'namespace'
    const val = 100

    const result = await client.setLimit(namespace, val)

    expect(result).toBeUndefined()
  })

  test('removeLimit(namespace: string): Promise<void>', async () => {
    const client = createManager()
    const namespace = 'namespace'

    const result = await client.removeLimit(namespace)

    expect(result).toBeUndefined()
  })

  test('purge(namespace: string): Promise<void>', async () => {
    const client = createManager()
    const namespace = 'namespace'

    const result = await client.purge(namespace)

    expect(result).toBeUndefined()
  })
})

function createManager() {
  return new PurgePolicyManager({
    server: 'http://localhost'
  , adminPassword: ADMIN_PASSWORD
  })
}
