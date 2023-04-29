import { server } from './follow.mock.js'
import { LoggerClient } from '@src/logger-client.js'
import { Observable, firstValueFrom } from 'rxjs'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
beforeEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('LoggerClient', () => {
  test('follow', async () => {
    const client = createClient()

    const observable = client.follow('id')
    const log = await firstValueFrom(observable)

    expect(observable).toBeInstanceOf(Observable)
    expect(log).toStrictEqual({ id: '0-0', value: 'value' })
  })
})

function createClient() {
  return new LoggerClient({ server: 'http://localhost' })
}
