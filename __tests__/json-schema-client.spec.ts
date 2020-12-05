import { server } from '@test/json-schema.mock'
import { JsonSchemaClient } from '@src/json-schema-client'
import { ADMIN_PASSWORD } from '@test/utils'
import '@blackglory/jest-matchers'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
beforeEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('JsonSchemaClient', () => {
  it('getIds(): Promise<string[]>', async () => {
    const client = createClient()

    const result = client.getIds()
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toStrictEqual(['id'])
  })

  it('get(id: string): Promise<Json>', async () => {
    const client = createClient()
    const id = 'id'

    const result = client.get(id)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeJson()
  })

  it('set(id: string, schema: Json): Promise<void>', async () => {
    const client = createClient()
    const id = 'id'
    const schema = {}

    const result = client.set(id, schema)
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
  return new JsonSchemaClient({
    server: 'http://localhost'
  , adminPassword: ADMIN_PASSWORD
  })
}
