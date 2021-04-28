import { server } from '@test/json-schema.mock'
import { JsonSchemaClient } from '@src/json-schema-client'
import { ADMIN_PASSWORD } from '@test/utils'
import '@blackglory/jest-matchers'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
beforeEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('JsonSchemaClient', () => {
  test('getNamespaces(): Promise<string[]>', async () => {
    const client = createClient()

    const result = client.getNamespaces()
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toStrictEqual(['namespace'])
  })

  test('get(namespace: string): Promise<Json>', async () => {
    const client = createClient()
    const namespace = 'namespace'

    const result = client.get(namespace)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeJson()
  })

  test('set(namespace: string, schema: Json): Promise<void>', async () => {
    const client = createClient()
    const namespace = 'namespace'
    const schema = {}

    const result = client.set(namespace, schema)
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
  return new JsonSchemaClient({
    server: 'http://localhost'
  , adminPassword: ADMIN_PASSWORD
  })
}
