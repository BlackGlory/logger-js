import { server } from '@test/blacklist.mock'
import { BlacklistClient } from '@src/blacklist-client'
import { ADMIN_PASSWORD } from '@test/utils'
import '@blackglory/jest-matchers'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
beforeEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('BlacklistClient', () => {
  it('getIds(): Promise<string[]>', async () => {
    const client = createClient()

    const result = client.getIds()
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toStrictEqual(['id'])
  })

  it('add(id: string): Promise<void>', async () => {
    const client = createClient()
    const id = 'id'

    const result = client.add(id)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })

  it('remove(id: string): Promise<void>', async () => {
    const client = createClient()
    const id = 'id'

    const result = client.remove(id)
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
