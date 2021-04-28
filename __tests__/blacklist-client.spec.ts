import { server } from '@test/blacklist.mock'
import { BlacklistClient } from '@src/blacklist-client'
import { ADMIN_PASSWORD } from '@test/utils'
import '@blackglory/jest-matchers'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
beforeEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('BlacklistClient', () => {
  test('getNamespaces(): Promise<string[]>', async () => {
    const client = createClient()

    const result = client.getNamespaces()
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toStrictEqual(['namespace'])
  })

  test('add(namespace: string): Promise<void>', async () => {
    const client = createClient()
    const namespace = 'namespace'

    const result = client.add(namespace)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })

  test('remove(namespace: string): Promise<void>', async () => {
    const client = createClient()
    const namespace = 'namespace'

    const result = client.remove(namespace)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })
})

function createClient() {
  return new BlacklistClient({
    server: 'http://localhost'
  , adminPassword: ADMIN_PASSWORD
  })
}
