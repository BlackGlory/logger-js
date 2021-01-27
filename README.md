# logger-js

## Install

```sh
npm install --save @blackglory/logger-js
# or
yarn add @blackglory/logger-js
```

## API

```ts
interface Log {
  id: string
  payload: string
}
```

```ts
interface JsonLog {
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
interface LoggerClientRequestOptions {
  signal?: AbortSignal
  token?: string
}
```

```ts
interface LoggerClientRequestOptionsWithoutToken {
  signal?: AbortSignal
}
```

```ts
interface LoggerClientObserveOptions {
  token?: string
}
```

#### write

```ts
LoggerClient#write(id: string, val: string, options?: LoggerClientRequestOptions): Promise<void>
```

#### writeJSON

```ts
LoggerClient#writeJSON(id: string, val: Json, options?: LoggerClientRequestOptions): Promise<void>
```

#### follow

```ts
LoggerClient#follow(id: string, options?: LoggerClientObserveOptions): Observable<Log>
```

#### followJSON

```ts
LoggerClient#followJSON(id: string, options?: LoggerClientObserveOptions): Observable<JsonLog>
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
, options?: LoggerClientRequestOptions
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
, options?: LoggerClientRequestOptions
): Promise<Array<JsonLog>>
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
, options?: LoggerClientRequestOptions
): Promise<void>
```

#### list

```ts
LoggerClient#list(options?: LoggerClientRequestOptionsWithoutToken): Promise<string[]>
```

### LoggerManager

```ts
new LoggerManager({
  server: string
, adminPassword: string
})
```

```ts
interface LoggerManagerRequestOptions {
  signal?: AbortSignal
}
```

#### JsonSchema

##### getIds

```ts
LoggerManager#JsonSchema.getIds(options?: LoggerManagerRequestOptions): Promise<string[]>
```

##### get

```ts
LoggerManager#JsonSchema.get(id: string, options?: LoggerManagerRequestOptions): Promise<Json>
```

##### set

```ts
LoggerManager#JsonSchema.set(id: string, schema: Json, options?: LoggerManagerRequestOptions): Promise<void>
```

##### remove

```ts
LoggerManager#JsonSchema.remove(id: string, options?: LoggerManagerRequestOptions): Promise<void>
```

#### PurgePolicy

##### getIds

```ts
LoggerManager#PurgePolicy.getIds(options?: LoggerManagerRequestOptions): Promise<string[]>
```

##### get

```ts
LoggerManager#PurgePolicy.get(id: string, options?: LoggerManagerRequestOptions): Promise<{
  timeToLive: number | null
  limit: number | null
}>
```

##### setTimeToLive

```ts
LoggerManager#PurgePolicy.setTimeToLive(id: string, val: number, options?: LoggerManagerRequestOptions): Promise<void>
```

##### removeTimeToLive

```ts
LoggerManager#PurgePolicy.removeTimeToLive(id: string, options?: LoggerManagerRequestOptions): Promise<void>
```

##### setLimit

```ts
LoggerManager#PurgePolicy.setLimit(id: string, val: boolean, options?: LoggerManagerRequestOptions): Promise<void>
```

##### removeLimit

```ts
LoggerManager#PurgePolicy.removeLimit(id: string, options?: LoggerManagerRequestOptions): Promise<void>
```

##### purge

```ts
LoggerManager#PurgePolicy.purge(id: string, options?: LoggerManagerRequestOptions): Promise<void>
```

#### Blacklist

##### getIds

```ts
LoggerManager#Blacklist.getIds(options?: LoggerManagerRequestOptions): Promise<string[]>
```

##### add

```ts
LoggerManager#Blacklist.add(id: string, options?: LoggerManagerRequestOptions): Promise<void>
```

##### remove

```ts
LoggerManager#Blacklist.remove(id: string, options?: LoggerManagerRequestOptions): Promise<void>
```

#### Whitelist

##### getIds

```ts
LoggerManager#Whitelist.getIds(options?: LoggerManagerRequestOptions): Promise<string[]>
```

##### add

```ts
LoggerManager#Whitelist.add(id: string, options?: LoggerManagerRequestOptions): Promise<void>
```

##### remove

```ts
LoggerManager#Whitelist.remove(id: string, options?: LoggerManagerRequestOptions): Promise<void>
```

#### TokenPolicy

##### getIds

```ts
LoggerManager#TokenPolicy.getIds(options?: LoggerManagerRequestOptions): Promise<string[]>
```

##### get

```ts
LoggerManager#TokenPolicy.get(id: string, options?: LoggerManagerRequestOptions): Promise<{
  writeTokenRequired: boolean | null
  readTokenRequired: boolean | null
  deleteTokenRequired: boolean | null
}>
```

##### setWriteTokenRequired

```ts
LoggerManager#TokenPolicy.setWriteTokenRequired(id: string, val: boolean, options?: LoggerManagerRequestOptions): Promise<void>
```

##### removeWriteTokenRequired

```ts
LoggerManager#TokenPolicy.removeWriteTokenRequired(id: string, options?: LoggerManagerRequestOptions): Promise<void>
```

##### setReadTokenRequired


```ts
LoggerManager#TokenPolicy.setReadTokenRequired(id: string, val: boolean, options?: LoggerManagerRequestOptions): Promise<void>
```

##### removeReadTokenRequired

```ts
LoggerManager#TokenPolicy.removeReadTokenRequired(id: string, options?: LoggerManagerRequestOptions): Promise<void>
```

##### setDeleteTokenRequired

```ts
LoggerManager#TokenPolicy.setDeleteTokenRequired(id: string, val: boolean, options?: LoggerManagerRequestOptions): Promise<void>
```

##### removeDeleteTokenRequired

```ts
LoggerManager#TokenPolicy.removeDeleteTokenRequired(id: string, options?: LoggerManagerRequestOptions): Promise<void>
```

#### Token

##### getIds

```ts
LoggerManager#Token.getIds(options?: LoggerManagerRequestOptions): Promise<string[]>
```

##### getTokens

```ts
LoggerManager#Token.getTokens(id: string, options?: LoggerManagerRequestOptions): Promise<Array<{
  token: string
  write: boolean
  read: boolean
  delete: boolean
}>>
```

##### addWriteToken

```ts
LoggerManager#Token.addWriteToken(id: string, token: string, options?: LoggerManagerRequestOptions): Promise<void>
```

##### removeWriteToken

```ts
LoggerManager#Token.removeWriteToken(id: string, token: string, options?: LoggerManagerRequestOptions): Promise<void>
```

##### addReadToken

```ts
LoggerManager#Token.addReadToken(id: string, token: string, options?: LoggerManagerRequestOptions): Promise<void>
```

##### removeReadToken

```ts
LoggerManager#Token.removeReadToken(id: string, token: string, options?: LoggerManagerRequestOptions): Promise<void>
```

##### addDeleteToken

```ts
LoggerManager#Token.addDeleteToken(id: string, token: string, options?: LoggerManagerRequestOptions): Promise<void>
```

##### removeDeleteToken

```ts
LoggerManager#Token.removeDeleteToken(id: string, token: string, options?: LoggerManagerRequestOptions): Promise<void>
```
