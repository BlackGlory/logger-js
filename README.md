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
})
```

```ts
interface ILoggerClientRequestOptions {
  signal?: AbortSignal
  token?: string
}
```

```ts
interface ILoggerClientRequestOptionsWithoutToken {
  signal?: AbortSignal
}
```

```ts
interface ILoggerClientObserveOptions {
  token?: string
}
```

#### write

```ts
LoggerClient#write(id: string, val: string, options?: ILoggerClientRequestOptions): Promise<void>
```

#### writeJSON

```ts
LoggerClient#writeJSON(id: string, val: Json, options?: ILoggerClientRequestOptions): Promise<void>
```

#### follow

```ts
LoggerClient#follow(id: string, options?: ILoggerClientObserveOptions): Observable<ILog>
```

#### followJSON

```ts
LoggerClient#followJSON(id: string, options?: ILoggerClientObserveOptions): Observable<IJsonLog>
```

#### query

```ts
LoggerClient#query(
  id: string
, query: {
    from?: string
    to?: string
    head?: number
    tail?: number
  }
, options?: ILoggerClientRequestOptions
): Promise<Log[]>
```

#### queryJSON

```ts
LoggerClient#queryJSON(
  id: string
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
  id: string
, query: {
    from?: string
    to?: string
    head?: number
    tail?: number
  }
, options?: ILoggerClientRequestOptions
): Promise<void>
```

#### getAllLoggerIds

```ts
LoggerClient#getAllLoggerIds(options?: ILoggerClientRequestOptionsWithoutToken): Promise<string[]>
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

##### getIds

```ts
LoggerManager#JsonSchema.getIds(options?: ILoggerManagerRequestOptions): Promise<string[]>
```

##### get

```ts
LoggerManager#JsonSchema.get(id: string, options?: ILoggerManagerRequestOptions): Promise<Json>
```

##### set

```ts
LoggerManager#JsonSchema.set(id: string, schema: Json, options?: ILoggerManagerRequestOptions): Promise<void>
```

##### remove

```ts
LoggerManager#JsonSchema.remove(id: string, options?: ILoggerManagerRequestOptions): Promise<void>
```

#### PurgePolicy

##### getIds

```ts
LoggerManager#PurgePolicy.getIds(options?: ILoggerManagerRequestOptions): Promise<string[]>
```

##### get

```ts
LoggerManager#PurgePolicy.get(id: string, options?: ILoggerManagerRequestOptions): Promise<{
  timeToLive: number | null
  limit: number | null
}>
```

##### setTimeToLive

```ts
LoggerManager#PurgePolicy.setTimeToLive(id: string, val: number, options?: ILoggerManagerRequestOptions): Promise<void>
```

##### removeTimeToLive

```ts
LoggerManager#PurgePolicy.removeTimeToLive(id: string, options?: ILoggerManagerRequestOptions): Promise<void>
```

##### setLimit

```ts
LoggerManager#PurgePolicy.setLimit(id: string, val: boolean, options?: ILoggerManagerRequestOptions): Promise<void>
```

##### removeLimit

```ts
LoggerManager#PurgePolicy.removeLimit(id: string, options?: ILoggerManagerRequestOptions): Promise<void>
```

##### purge

```ts
LoggerManager#PurgePolicy.purge(id: string, options?: ILoggerManagerRequestOptions): Promise<void>
```

#### Blacklist

##### getIds

```ts
LoggerManager#Blacklist.getIds(options?: ILoggerManagerRequestOptions): Promise<string[]>
```

##### add

```ts
LoggerManager#Blacklist.add(id: string, options?: ILoggerManagerRequestOptions): Promise<void>
```

##### remove

```ts
LoggerManager#Blacklist.remove(id: string, options?: ILoggerManagerRequestOptions): Promise<void>
```

#### Whitelist

##### getIds

```ts
LoggerManager#Whitelist.getIds(options?: ILoggerManagerRequestOptions): Promise<string[]>
```

##### add

```ts
LoggerManager#Whitelist.add(id: string, options?: ILoggerManagerRequestOptions): Promise<void>
```

##### remove

```ts
LoggerManager#Whitelist.remove(id: string, options?: ILoggerManagerRequestOptions): Promise<void>
```

#### TokenPolicy

##### getIds

```ts
LoggerManager#TokenPolicy.getIds(options?: ILoggerManagerRequestOptions): Promise<string[]>
```

##### get

```ts
LoggerManager#TokenPolicy.get(id: string, options?: ILoggerManagerRequestOptions): Promise<{
  writeTokenRequired: boolean | null
  readTokenRequired: boolean | null
  deleteTokenRequired: boolean | null
}>
```

##### setWriteTokenRequired

```ts
LoggerManager#TokenPolicy.setWriteTokenRequired(id: string, val: boolean, options?: ILoggerManagerRequestOptions): Promise<void>
```

##### removeWriteTokenRequired

```ts
LoggerManager#TokenPolicy.removeWriteTokenRequired(id: string, options?: ILoggerManagerRequestOptions): Promise<void>
```

##### setReadTokenRequired


```ts
LoggerManager#TokenPolicy.setReadTokenRequired(id: string, val: boolean, options?: ILoggerManagerRequestOptions): Promise<void>
```

##### removeReadTokenRequired

```ts
LoggerManager#TokenPolicy.removeReadTokenRequired(id: string, options?: ILoggerManagerRequestOptions): Promise<void>
```

##### setDeleteTokenRequired

```ts
LoggerManager#TokenPolicy.setDeleteTokenRequired(id: string, val: boolean, options?: ILoggerManagerRequestOptions): Promise<void>
```

##### removeDeleteTokenRequired

```ts
LoggerManager#TokenPolicy.removeDeleteTokenRequired(id: string, options?: ILoggerManagerRequestOptions): Promise<void>
```

#### Token

##### getIds

```ts
LoggerManager#Token.getIds(options?: ILoggerManagerRequestOptions): Promise<string[]>
```

##### getTokens

```ts
LoggerManager#Token.getTokens(id: string, options?: ILoggerManagerRequestOptions): Promise<Array<{
  token: string
  write: boolean
  read: boolean
  delete: boolean
}>>
```

##### addWriteToken

```ts
LoggerManager#Token.addWriteToken(id: string, token: string, options?: ILoggerManagerRequestOptions): Promise<void>
```

##### removeWriteToken

```ts
LoggerManager#Token.removeWriteToken(id: string, token: string, options?: ILoggerManagerRequestOptions): Promise<void>
```

##### addReadToken

```ts
LoggerManager#Token.addReadToken(id: string, token: string, options?: ILoggerManagerRequestOptions): Promise<void>
```

##### removeReadToken

```ts
LoggerManager#Token.removeReadToken(id: string, token: string, options?: ILoggerManagerRequestOptions): Promise<void>
```

##### addDeleteToken

```ts
LoggerManager#Token.addDeleteToken(id: string, token: string, options?: ILoggerManagerRequestOptions): Promise<void>
```

##### removeDeleteToken

```ts
LoggerManager#Token.removeDeleteToken(id: string, token: string, options?: ILoggerManagerRequestOptions): Promise<void>
```
