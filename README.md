# logger-js
## Install
```sh
npm install --save @blackglory/logger-js
# or
yarn add @blackglory/logger-js
```

## API
### LoggerClient
```ts
interface ILoggerClientOptions {
  server: string
  basicAuth?: {
    username: string
    password: string
  }
  keepalive?: boolean
  heartbeat?: IHeartbeatOptions
  timeout?: number
}

interface ILoggerClientRequestOptions {
  signal?: AbortSignal
  keepalive?: boolean
  timeout?: number | false
}

export interface ILoggerClientFollowOptions extends ILoggerClientRequestOptions {
  since?: LogId
  heartbeat?: IHeartbeatOptions
}

interface IHeartbeatOptions {
  timeout: number
}

interface ILoggerConfig extends JSONObject {
  timeToLive: number | null
  limit: number | null
}

type LogId = `${number}-${number}`

interface IRange {
  order: Order
  from?: LogId
  to?: LogId
  skip?: number
  limit?: number
}

enum Order {
  Asc = 'asc'
, Desc = 'desc'
}

interface ILog {
  id: LogId
  value: JSONValue
}

class LoggerNotFound extends CustomError {}

class LoggerClient {
  constructor(options: ILoggerClientOptions)

  getAllLoggerIds(options?: ILoggerClientRequestOptions): Promise<string[]>

  setLogger(
    loggerId: string
  , config: ILoggerConfig
  , options?: ILoggerClientRequestOptions
  ): Promise<void>

  getLogger(
    loggerId: string
  , options?: ILoggerClientRequestOptions
  ): Promise<ILoggerConfig | null>

  removeLogger(
    loggerId: string
  , options?: ILoggerClientRequestOptions
  ): Promise<void>

  log(
    loggerId: string
  , value: JSONValue
  , options?: ILoggerClientRequestOptions
  ): Promise<void>

  /**
   * @throws {LoggerNotFound}
   */
  follow(
    loggerId: string
  , options?: ILoggerClientFollowOptions
  ): AsyncIterableIterator<ILog>

  /**
   * @throws {LoggerNotFound}
   */
  getLogs(
    loggerId: string
  , logIds: LogId[]
  , options?: ILoggerClientRequestOptions
  ): Promise<Array<JSONValue | null>>

  removeLogs(
    loggerId: string
  , logIds: LogId[]
  , options?: ILoggerClientRequestOptions
  ): Promise<void>

  /**
   * @throws {LoggerNotFound}
   */
  queryLogs(
    loggerId: string
  , range: IRange
  , options?: ILoggerClientRequestOptions
  ): Promise<ILog[]>

  clearLogs(
    loggerId: string
  , range: IRange
  , options?: ILoggerClientRequestOptions
  ): Promise<void>
}

class HeartbeatTimeoutError extends CustomError {}
class LoggerNotFound extends CustomError {}
```
