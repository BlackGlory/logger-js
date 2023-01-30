import { assert, isJSONValue } from '@blackglory/prelude'
import { server } from './json-schema-manager.mock.js'
import { JsonSchemaManager } from '@manager/json-schema-manager.js'
import { ADMIN_PASSWORD } from '@test/utils.js'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
beforeEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('JsonSchemaManager', () => {
  test('getNamespaces(): Promise<string[]>', async () => {
    const client = createManager()

    const result = await client.getNamespaces()

    expect(result).toStrictEqual(['namespace'])
  })

  test('get(namespace: string): Promise<Json>', async () => {
    const client = createManager()
    const namespace = 'namespace'

    const result = await client.get(namespace)

    assert(isJSONValue(result), 'result is not JSON')
  })

  test('set(namespace: string, schema: Json): Promise<void>', async () => {
    const client = createManager()
    const namespace = 'namespace'
    const schema = {}

    const result = await client.set(namespace, schema)

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
  return new JsonSchemaManager({
    server: 'http://localhost'
  , adminPassword: ADMIN_PASSWORD
  })
}
