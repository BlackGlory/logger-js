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

class HeartbeatTimeoutError extends CustomError {}
class LoggerNotFound extends CustomError {}

class LoggerClient {
  getAllLoggerIds(): Promise<string[]>

  setLogger(loggerId: string, config: ILoggerConfig): Promise<void>
  getLogger(loggerId: string): Promise<ILoggerConfig | null>
  removeLogger(loggerId: string): Promise<void>

  /**
   * @throws {LoggerNotFound}
   */
  log(loggerId: string, content: JSONValue): void

  /**
   * @throws {LoggerNotFound}
   */
  follow(loggerId: string): Observable<ILog>

  /**
   * @throws {LoggerNotFound}
   */
  getLogs(loggerId: string, logIds: LogId[]): Array<ILog | null> | null

  removeLogs(loggerId: string, logIds: LogId[]): void

  /**
   * @throws {LoggerNotFound}
   */
  queryLogs(loggerId: string, range: IRange): ILog[]

  clearLogs(loggerId: string, range: IRange): void
}
```
