import { server } from './logger-client.mock.js'
import { ILog, LoggerClient, LoggerNotFound, Order } from '@src/logger-client.js'
import { getErrorPromise } from 'return-style'
import { delay } from 'extra-promise'
import { firstAsync, toArrayAsync } from 'iterable-operator'

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

  describe('follow', () => {
    test('found', async () => {
      const client = createClient()

      const log = await firstAsync(client.follow('found'))

      expect(log).toStrictEqual({ id: '0-0', value: 'value' })
    })

    test('not found', async () => {
      const client = createClient()

      const err = await getErrorPromise(toArrayAsync(client.follow('not-found')))

      expect(err).toBeInstanceOf(LoggerNotFound)
    })

    // 此处的心跳检测测试通过客户端超时来模拟服务器超时, 这是因为msw不支持模拟服务器超时.
    describe('heartbeat', () => {
      test('timeout', async () => {
        const client = createClient()
        const iter = client.follow('found', { heartbeat: { timeout: 500 }})

        const results: ILog[] = []
        for await (const message of iter) {
          results.push(message)
          if (results.length === 2) break
          await delay(600)
        }

        expect(results).toStrictEqual([
          { id: '0-0', value: 'value' }
        , { id: '0-0', value: 'value' }
        ])
      })

      test('no timeout', async () => {
        const client = createClient()
        const iter = client.follow('found', { heartbeat: { timeout: 500 }})

        const results: ILog[] = []
        for await (const message of iter) {
          results.push(message)
          if (results.length === 2) break
          await delay(400)
        }

        expect(results).toStrictEqual([
          { id: '0-0', value: 'value' }
        , { id: '0-0', value: 'value' }
        ])
      })
    })
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
