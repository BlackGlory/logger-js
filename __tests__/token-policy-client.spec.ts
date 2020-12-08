import { server } from '@test/token-policy.mock'
import { TokenPolicyClient } from '@src/token-policy-client'
import { ADMIN_PASSWORD } from '@test/utils'
import '@blackglory/jest-matchers'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
beforeEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('TokenPolicyClient', () => {
  it('getIds(): Promise<string[]>', async () => {
    const client = createClient()

    const result = client.getIds()
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toStrictEqual(['id'])
  })

  it('get(id: string): Promise<{ writeTokenRequired: boolean | null; readTokenRequired: boolean | null }>', async () => {
    const client = createClient()
    const id = 'id'

    const result = client.get(id)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toStrictEqual({
      writeTokenRequired: true
    , readTokenRequired: false
    , deleteTokenRequired: null
    })
  })

  it('setWriteTokenRequired(id: string, val: boolean): Promise<void>', async () => {
    const client = createClient()
    const id = 'id'
    const val = true

    const result = client.setWriteTokenRequired(id, val)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })

  it('removeWriteTokenRequired(id: string): Promise<void>', async () => {
    const client = createClient()
    const id = 'id'

    const result = client.removeWriteTokenRequired(id)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })

  it('setReadTokenRequired(id: string, val: boolean): Promise<void>', async () => {
    const client = createClient()
    const id = 'id'
    const val = true

    const result = client.setReadTokenRequired(id, val)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })

  it('removeReadTokenRequired(id: string): Promise<void>', async () => {
    const client = createClient()
    const id = 'id'

    const result = client.removeReadTokenRequired(id)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })

  it('setDeleteTokenRequired(id: string, val: boolean): Promise<void>', async () => {
    const client = createClient()
    const id = 'id'
    const val = true

    const result = client.setDeleteTokenRequired(id, val)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })

  it('removeDeleteTokenRequired(id: string): Promise<void>', async () => {
    const client = createClient()
    const id = 'id'

    const result = client.removeDeleteTokenRequired(id)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })
})

function createClient() {
  return new TokenPolicyClient({
    server: 'http://localhost'
  , adminPassword: ADMIN_PASSWORD
  })
}
