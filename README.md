# logger-js

## Install

```sh
npm install --save @blackglory/logger-js
# or
yarn add @blackglory/logger-js
```

## API

```ts
interface ILog {
  id: string
  payload: string
}
```

```ts
interface IJsonLog {
  id: string
  payload: Json
}
```

### LoggerClient

```ts
new LoggerClient({
  server: string
, token?: string
, keepalive?: boolean
, heartbeat?: IHeartbeatOptions
})
```

```ts
interface ILoggerClientRequestOptions {
  signal?: AbortSignal
  token?: string
  keepalive?: boolean
}
```

```ts
interface ILoggerClientRequestOptionsWithoutToken {
  signal?: AbortSignal
  keepalive?: booolean
}
```

```ts
interface ILoggerClientObserveOptions {
  token?: string
  heartbeat?: IHeartbeatOptions
}
```

```ts
interface IHeartbeatOptions {
  timeout: number
}
```

#### write

```ts
LoggerClient#write(
  namespace: string
, val: string
, options?: ILoggerClientRequestOptions
): Promise<void>
```

#### writeJSON

```ts
LoggerClient#writeJSON(
  namespace: string
, val: Json
, options?: ILoggerClientRequestOptions
): Promise<void>
```

#### follow

```ts
LoggerClient#follow(
  namespace: string
, options?: ILoggerClientObserveOptions
): Observable<ILog>
```

#### followJSON

```ts
LoggerClient#followJSON(
  namespace: string
, options?: ILoggerClientObserveOptions
): Observable<IJsonLog>
```

#### query

```ts
LoggerClient#query(
  namespace: string
, query: {
    from?: string
    to?: string
    head?: number
    tail?: number
  }
, options?: ILoggerClientRequestOptions
): Promise<ILog[]>
```

#### queryJSON

```ts
LoggerClient#queryJSON(
  namespace: string
, query: {
    from?: string
    to?: string
    head?: number
    tail?: number
  }
, options?: ILoggerClientRequestOptions
): Promise<Array<IJsonLog>>
```

#### del

```ts
LoggerClient#del(
  namespace: string
, query: {
    from?: string
    to?: string
    head?: number
    tail?: number
  }
, options?: ILoggerClientRequestOptions
): Promise<void>
```

#### getAllNamespaces

```ts
LoggerClient#getAllNamespaces(options?: ILoggerClientRequestOptionsWithoutToken): Promise<string[]>
```

### LoggerManager

```ts
new LoggerManager({
  server: string
, adminPassword: string
})
```

```ts
interface ILoggerManagerRequestOptions {
  signal?: AbortSignal
}
```

#### JsonSchema

##### getNamespaces

```ts
LoggerManager#JsonSchema.getNamespaces(
  options?: ILoggerManagerRequestOptions
): Promise<string[]>
```

##### get

```ts
LoggerManager#JsonSchema.get(
  namespace: string
, options?: ILoggerManagerRequestOptions
): Promise<Json>
```

##### set

```ts
LoggerManager#JsonSchema.set(
  namespace: string
, schema: Json
, options?: ILoggerManagerRequestOptions
): Promise<void>
```

##### remove

```ts
LoggerManager#JsonSchema.remove(
  namespace: string
, options?: ILoggerManagerRequestOptions
): Promise<void>
```

#### PurgePolicy

##### getNamespaces

```ts
LoggerManager#PurgePolicy.getNamespaces(
  options?: ILoggerManagerRequestOptions
): Promise<string[]>
```

##### get

```ts
LoggerManager#PurgePolicy.get(
  namespace: string
, options?: ILoggerManagerRequestOptions
): Promise<{
  timeToLive: number | null
  limit: number | null
}>
```

##### setTimeToLive

```ts
LoggerManager#PurgePolicy.setTimeToLive(
  namespace: string
, val: number
, options?: ILoggerManagerRequestOptions
): Promise<void>
```

##### removeTimeToLive

```ts
LoggerManager#PurgePolicy.removeTimeToLive(
  namespace: string
, options?: ILoggerManagerRequestOptions
): Promise<void>
```

##### setLimit

```ts
LoggerManager#PurgePolicy.setLimit(
  namespace: string
, val: boolean
, options?: ILoggerManagerRequestOptions
): Promise<void>
```

##### removeLimit

```ts
LoggerManager#PurgePolicy.removeLimit(
  namespace: string
, options?: ILoggerManagerRequestOptions
): Promise<void>
```

##### purge

```ts
LoggerManager#PurgePolicy.purge(
  namespace: string
, options?: ILoggerManagerRequestOptions
): Promise<void>
```

#### Blacklist

##### getNamespaces

```ts
LoggerManager#Blacklist.getNamespaces(
  options?: ILoggerManagerRequestOptions
): Promise<string[]>
```

##### add

```ts
LoggerManager#Blacklist.add(
  namespace: string
, options?: ILoggerManagerRequestOptions
): Promise<void>
```

##### remove

```ts
LoggerManager#Blacklist.remove(
  namespace: string
, options?: ILoggerManagerRequestOptions
): Promise<void>
```

#### Whitelist

##### getNamespaces

```ts
LoggerManager#Whitelist.getNamespaces(
  options?: ILoggerManagerRequestOptions
): Promise<string[]>
```

##### add

```ts
LoggerManager#Whitelist.add(
  namespace: string
, options?: ILoggerManagerRequestOptions
): Promise<void>
```

##### remove

```ts
LoggerManager#Whitelist.remove(
  namespace: string
, options?: ILoggerManagerRequestOptions
): Promise<void>
```

#### TokenPolicy

##### getNamespaces

```ts
LoggerManager#TokenPolicy.getNamespaces(
  options?: ILoggerManagerRequestOptions
): Promise<string[]>
```

##### get

```ts
LoggerManager#TokenPolicy.get(
  namespace: string
, options?: ILoggerManagerRequestOptions
): Promise<{
  writeTokenRequired: boolean | null
  readTokenRequired: boolean | null
  deleteTokenRequired: boolean | null
}>
```

##### setWriteTokenRequired

```ts
LoggerManager#TokenPolicy.setWriteTokenRequired(
  namespace: string
, val: boolean
, options?: ILoggerManagerRequestOptions
): Promise<void>
```

##### removeWriteTokenRequired

```ts
LoggerManager#TokenPolicy.removeWriteTokenRequired(
  namespace: string
, options?: ILoggerManagerRequestOptions
): Promise<void>
```

##### setReadTokenRequired


```ts
LoggerManager#TokenPolicy.setReadTokenRequired(
  namespace: string
, val: boolean
, options?: ILoggerManagerRequestOptions
): Promise<void>
```

##### removeReadTokenRequired

```ts
LoggerManager#TokenPolicy.removeReadTokenRequired(
  namespace: string
, options?: ILoggerManagerRequestOptions
): Promise<void>
```

##### setDeleteTokenRequired

```ts
LoggerManager#TokenPolicy.setDeleteTokenRequired(
  namespace: string
, val: boolean
, options?: ILoggerManagerRequestOptions
): Promise<void>
```

##### removeDeleteTokenRequired

```ts
LoggerManager#TokenPolicy.removeDeleteTokenRequired(
  namespace: string
, options?: ILoggerManagerRequestOptions
): Promise<void>
```

#### Token

##### getNamespaces

```ts
LoggerManager#Token.getNamespaces(options?: ILoggerManagerRequestOptions): Promise<string[]>
```

##### getTokens

```ts
LoggerManager#Token.getTokens(
  namespace: string
, options?: ILoggerManagerRequestOptions
): Promise<Array<{
  token: string
  write: boolean
  read: boolean
  delete: boolean
}>>
```

##### addWriteToken

```ts
LoggerManager#Token.addWriteToken(
  namespace: string
, token: string
, options?: ILoggerManagerRequestOptions
): Promise<void>
```

##### removeWriteToken

```ts
LoggerManager#Token.removeWriteToken(
  namespace: string
, token: string
, options?: ILoggerManagerRequestOptions
): Promise<void>
```

##### addReadToken

```ts
LoggerManager#Token.addReadToken(
  namespace: string
, token: string
, options?: ILoggerManagerRequestOptions
): Promise<void>
```

##### removeReadToken

```ts
LoggerManager#Token.removeReadToken(
  namespace: string
, token: string
, options?: ILoggerManagerRequestOptions
): Promise<void>
```

##### addDeleteToken

```ts
LoggerManager#Token.addDeleteToken(
  namespace: string
, token: string
, options?: ILoggerManagerRequestOptions
): Promise<void>
```

##### removeDeleteToken

```ts
LoggerManager#Token.removeDeleteToken(
  namespace: string
, token: string
, options?: ILoggerManagerRequestOptions
): Promise<void>
```
