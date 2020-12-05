import { server } from '@test/purge-policy.mock'
import { PurgePolicyClient } from '@src/purge-policy-client'
import { ADMIN_PASSWORD } from '@test/utils'
import '@blackglory/jest-matchers'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
beforeEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('PurgePolicyClient', () => {
  it('getIds(): Promise<string[]>', async () => {
    const client = createClient()

    const result = client.getIds()
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toStrictEqual(['id'])
  })

  it('get(id: string): Promise<{ timeToLive: number | null; limit: number | null }>', async () => {
    const client = createClient()
    const id = 'id'

    const result = client.get(id)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toStrictEqual({
      timeToLive: 100
    , limit: 200
    })
  })

  it('setTimeToLive(id: string, val: number): Promise<void>', async () => {
    const client = createClient()
    const id = 'id'
    const val = 100

    const result = client.setTimeToLive(id, val)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })

  it('removeTimeToLive(id: string): Promise<void>', async () => {
    const client = createClient()
    const id = 'id'

    const result = client.removeTimeToLive(id)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })

  it('setLimit(id: string, val: number): Promise<void>', async () => {
    const client = createClient()
    const id = 'id'
    const val = 100

    const result = client.setLimit(id, val)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })

  it('removeLimit(id: string): Promise<void>', async () => {
    const client = createClient()
    const id = 'id'

    const result = client.removeLimit(id)
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
