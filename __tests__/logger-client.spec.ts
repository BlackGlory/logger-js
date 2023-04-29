import { server } from './logger-client.mock.js'
import { LoggerClient, LoggerNotFound, Order } from '@src/logger-client.js'
import { getErrorPromise } from 'return-style'
import { Observable, firstValueFrom } from 'rxjs'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
beforeEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('LoggerClient', () => {
  test('getAllLoggerIds', async () => {
    const client = createClient()

    const result = await client.getAllLoggerIds()

    expect(result).toStrictEqual(['id'])
  })

  test('setLogger', async () => {
    const client = createClient()

    await client.setLogger('id', {
      limit: 100
    , timeToLive: 200
    })
  })

  describe('getLogger', () => {
    test('logger does not exist', async () => {
      const client = createClient()

      const result = await client.getLogger('not-found')

      expect(result).toBe(null)
    })

    test('logger exists', async () => {
      const client = createClient()

      const result = await client.getLogger('found')

      expect(result).toStrictEqual({
        limit: 100
      , timeToLive: 200
      })
    })
  })

  test('removeLogger', async () => {
    const client = createClient()

    await client.removeLogger('id')
  })

  describe('log', () => {
    test('logger does not exist', async () => {
      const client = createClient()

      const err = await getErrorPromise(client.log('not-found', 'content'))

      expect(err).toBeInstanceOf(LoggerNotFound)
    })

    test('logger exists', async () => {
      const client = createClient()

      await client.log('found', 'content')
    })
  })

  test('follow', async () => {
    const client = createClient()

    const observable = client.follow('id')
    const log = await firstValueFrom(observable)

    expect(observable).toBeInstanceOf(Observable)
    expect(log).toStrictEqual({ id: '0-0', value: 'value' })
  })

  describe('getLogs', () => {
    test('logger does not exist', async () => {
      const client = createClient()

      const err = await getErrorPromise(client.getLogs('not-found', ['0-0', '0-1', '1-0']))

      expect(err).toBeInstanceOf(LoggerNotFound)
    })

    test('logger exists', async () => {
      const client = createClient()

      const result = await client.getLogs('found', ['0-0', '0-1', '1-0'])

      expect(result).toStrictEqual([
        'content-1'
      , null
      , 'content-2'
      ])
    })
  })

  test('removeLogs', async () => {
    const client = createClient()

    await client.removeLogs('id', ['0-0', '0-1', '1-0'])
  })

  describe('queryLogs', () => {
    test('logger does not exist', async () => {
      const client = createClient()

      const err = await getErrorPromise(client.queryLogs('not-found', {
        order: Order.Asc
      }))

      expect(err).toBeInstanceOf(LoggerNotFound)
    })

    test('logger exists', async () => {
      const client = createClient()

      const result = await client.queryLogs('found', {
        order: Order.Asc
      })

      expect(result).toStrictEqual([
        { id: '0-0', content: 'content' }
      ])
    })
  })

  test('clearLogs', async () => {
    const client = createClient()

    await client.clearLogs('id', {
      order: Order.Asc
    })
  })
})

function createClient() {
  return new LoggerClient({ server: 'http://localhost' })
}
