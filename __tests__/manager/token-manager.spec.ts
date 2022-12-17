import { server } from './token-manager.mock'
import { TokenManager } from '@manager/token-manager'
import { ADMIN_PASSWORD } from '@test/utils'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
beforeEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('TokenManager', () => {
  test('getNamespaces(): Promise<string[]>', async () => {
    const client = createManager()

    const result = await client.getNamespaces()

    expect(result).toStrictEqual(['namespace'])
  })

  it(`
    getTokens(
      namespace: string
    ): Promise<Array<{ token: string; write: boolean; read: boolean }>>
  `, async () => {
    const client = createManager()
    const namespace = 'namespace'

    const result = await client.getTokens(namespace)

    expect(result).toStrictEqual([{
      token: 'token'
    , write: true
    , read: false
    , delete: false
    }])
  })

  test('addWriteToken(namespace: string, token: string): Promise<void>', async () => {
    const client = createManager()
    const namespace = 'namespace'
    const token = 'token'

    const result = await client.addWriteToken(namespace, token)

    expect(result).toBeUndefined()
  })

  test('removeWriteToken(namespace: string, token: string): Promise<void>', async () => {
    const client = createManager()
    const namespace = 'namespace'
    const token = 'token'

    const result = await client.removeWriteToken(namespace, token)

    expect(result).toBeUndefined()
  })

  test('addReadToken(namespace: string, token: string): Promise<void>', async () => {
    const client = createManager()
    const namespace = 'namespace'
    const token = 'token'

    const result = await client.addReadToken(namespace, token)

    expect(result).toBeUndefined()
  })

  test('removeReadToken(namespace: string, token: string): Promise<void>', async () => {
    const client = createManager()
    const namespace = 'namespace'
    const token = 'token'

    const result = await client.removeReadToken(namespace, token)

    expect(result).toBeUndefined()
  })

  test('addDeleteToken(namespace: string, token: string): Promise<void>', async () => {
    const client = createManager()
    const namespace = 'namespace'
    const token = 'token'

    const result = await client.addDeleteToken(namespace, token)

    expect(result).toBeUndefined()
  })

  test('removeDeleteToken(namespace: string, token: string): Promise<void>', async () => {
    const client = createManager()
    const namespace = 'namespace'
    const token = 'token'

    const result = await client.removeDeleteToken(namespace, token)

    expect(result).toBeUndefined()
  })
})

function createManager() {
  return new TokenManager({
    server: 'http://localhost'
  , adminPassword: ADMIN_PASSWORD
  })
}
