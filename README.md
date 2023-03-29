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

interface ILoggerClientObserveOptions {
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
  content: JSONValue
}

class HeartbeatTimeoutError extends CustomError {}
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
  , content: JSONValue
  , options?: ILoggerClientRequestOptions
  ): Promise<void>

  /**
   * @throws {HeartbeatTimeoutError} from Observable
   */
  follow(
    loggerId: string
  , options?: ILoggerClientObserveOptions
  ): Observable<ILog>

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
