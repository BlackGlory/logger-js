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
interface IQuery {
  from?: string
  to?: string
  head?: number
  tail?: number
}

interface ILog {
  id: string
  payload: string
}

interface IJsonLog<T> {
  id: string
  payload: T
}

interface ILoggerClientOptions {
  server: string
  token?: string
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
  token?: string
  keepalive?: boolean
  timeout?: number | false
}

interface ILoggerClientRequestOptionsWithoutToken {
  signal?: AbortSignal
  keepalive?: boolean
  timeout?: number | false
}

interface ILoggerClientObserveOptions {
  token?: string
  heartbeat?: IHeartbeatOptions
}

interface IHeartbeatOptions {
  timeout: number
}

class LoggerClient {
  constructor(options: ILoggerClientOptions)

  write(
    namespace: string
  , val: string
  , options: ILoggerClientRequestOptions = {}
  ): Promise<void>

  writeJSON<T>(
    namespace: string
  , val: T
  , options?: ILoggerClientRequestOptions
  ): Promise<void>

  follow(
    namespace: string
  , options: ILoggerClientObserveOptions = {}
  ): Observable<ILog>

  followJSON<T>(
    namespace: string
  , options?: ILoggerClientObserveOptions
  ): Observable<IJsonLog<T>>

  query(
    namespace: string
  , query: IQuery
  , options: ILoggerClientRequestOptions = {}
  ): Promise<ILog[]>

  queryJSON<T>(
    namespace: string
  , query: IQuery
  , options?: ILoggerClientRequestOptions
  ): Promise<Array<IJsonLog<T>>>

  del(
    namespace: string
  , query: IQuery
  , options: ILoggerClientRequestOptions = {}
  ): Promise<void>

  getAllNamespaces(
    options: ILoggerClientRequestOptionsWithoutToken = {}
  ): Promise<string[]>
}

class HeartbeatTimeoutError extends CustomError {}
```

### LoggerManager
```ts
interface ILoggerManagerRequestOptions {
  signal?: AbortSignal
  keepalive?: boolean
  timeout?: number | false
}

interface ILoggerManagerOptions {
  server: string
  adminPassword: string
  keepalive?: boolean
  timeout?: number
}

class LoggerManager {
  constructor(options: ILoggerManagerOptions)

  JsonSchema: JsonSchemaManager
  Blacklist: BlacklistManager
  Whitelist: WhitelistManager
  TokenPolicy: TokenPolicyManager
  Token: TokenManager
  PurgePolicy: PurgePolicyManager
}
```

#### JsonSchemaManager
```ts
class JsonSchemaManager {
  getNamespaces(options: ILoggerManagerRequestOptions = {}): Promise<string[]>
  get(namespace: string, options: ILoggerManagerRequestOptions = {}): Promise<unknown>
  set(
    namespace: string
  , schema: Json
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void>
  remove(namespace: string, options: ILoggerManagerRequestOptions = {}): Promise<void>
}
```

#### BlacklistManager
```ts
class BlacklistManager {
  getNamespaces(options: ILoggerManagerRequestOptions = {}): Promise<string[]>
  add(namespace: string, options: ILoggerManagerRequestOptions = {}): Promise<void>
  remove(namespace: string, options: ILoggerManagerRequestOptions = {}): Promise<void>
}
```

#### WhitelistManager
```ts
class WhitelistManager {
  getNamespaces(options: ILoggerManagerRequestOptions = {}): Promise<string[]>
  add(namespace: string, options: ILoggerManagerRequestOptions = {}): Promise<void>
  remove(
    namespace: string
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void>
}
```

#### TokenPolicyManager
```ts
interface ITokenPolicy {
  writeTokenRequired: boolean | null
  readTokenRequired: boolean | null
  deleteTokenRequired: boolean | null
}

class TokenPolicyManager {
  getNamespaces(options: ILoggerManagerRequestOptions = {}): Promise<string[]>
  get(
    namespace: string
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<ITokenPolicy>
  setWriteTokenRequired(
    namespace: string
  , val: boolean
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void>
  removeWriteTokenRequired(
    namespace: string
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void>
  setReadTokenRequired(
    namespace: string
  , val: boolean
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void>
  removeReadTokenRequired(
    namespace: string
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void>
  setDeleteTokenRequired(
    namespace: string
  , val: boolean
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void>
  removeDeleteTokenRequired(
    namespace: string
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void>
}
```

#### TokenManager
```ts
interface ITokenInfo {
  token: string
  write: boolean
  read: boolean
  delete: boolean
}

class TokenManager {
  getNamespaces(options: ILoggerManagerRequestOptions = {}): Promise<string[]>
  getTokens(
    namespace: string
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<ITokenInfo[]>
  addWriteToken(
    namespace: string
  , token: string
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void>
  removeWriteToken(
    namespace: string
  , token: string
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void>
  addReadToken(
    namespace: string
  , token: string
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void>
  removeReadToken(
    namespace: string
  , token: string
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void>
  addDeleteToken(
    namespace: string
  , token: string
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void>
  removeDeleteToken(
    namespace: string
  , token: string
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void>
}
```

#### PurgePolicyManager
```ts
interface IPurgePolicy {
  timeToLive: number | null
  limit: number | null
}

class PurgePolicyManager {
  getNamespaces(options: ILoggerManagerRequestOptions = {}): Promise<string[]>
  get(
    namespace: string
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<IPurgePolicy>
  setTimeToLive(
    namespace: string
  , val: number
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void>
  removeTimeToLive(
    namespace: string
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void>
  setLimit(
    namespace: string
  , val: number
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void>
  removeLimit(
    namespace: string
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void>
  purge(namespace: string, options: ILoggerManagerRequestOptions = {}): Promise<void>
}
```
