import { server } from './whitelist-manager.mock'
import { WhitelistManager } from '@manager/whitelist-manager'
import { ADMIN_PASSWORD } from '@test/utils'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
beforeEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('whitelist', () => {
  test('getNamespaces(): Promise<string[]>', async () => {
    const client = createManager()

    const result = await client.getNamespaces()

    expect(result).toStrictEqual(['namespace'])
  })

  test('add(namespace: string): Promise<void>', async () => {
    const client = createManager()
    const namespace = 'namespace'

    const result = await client.add(namespace)

    expect(result).toBeUndefined()
  })

  test('remove(namespace: string): Promise<void>', async () => {
    const client = createManager()
    const namespace = 'namespace'

    const result = await client.remove(namespace)

    expect(result).toBeUndefined()
  })
})

function createManager() {
  return new WhitelistManager({
    server: 'http://localhost'
  , adminPassword: ADMIN_PASSWORD
  })
}
