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

#### write

```ts
LoggerClient#write(id: string, val: string, options?: { token?: string }): Promise<void>
```

#### writeJSON

```ts
LoggerClient#writeJSON(id: string, val: Json, options?: { token?: string }): Promise<void>
```

#### follow

```ts
LoggerClient#follow(id: string, options?: { token?: string }): Observable<Log>
```

#### followJSON

```ts
LoggerClient#followJSON(id: string, options?: { token?: string }): Observable<JsonLog>
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
, options?: { token?: string }
): AsyncIterable<Log>
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
, options?: { token?: string }
): AsyncIterable<JsonLog>
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
, options?: { token?: string }
): Promise<void>
```

### LoggerManager

```ts
new LoggerManager({
  server: string
, adminPassword: string
})
```

#### JsonSchema

##### getIds

```ts
LoggerManager#JsonSchema.getIds(): Promise<string[]>
```

##### get

```ts
LoggerManager#JsonSchema.get(id: string): Promise<Json>
```

##### set

```ts
LoggerManager#JsonSchema.set(id: string, schema: Json): Promise<void>
```

##### remove

```ts
LoggerManager#JsonSchema.remove(id: string): Promise<void>
```

#### PurgePolicy

##### getIds

```ts
LoggerManager#PurgePolicy.getIds(): Promise<string[]>
```

##### get

```ts
LoggerManager#PurgePolicy.get(id: string): Promise<{
  timeToLive: number | null
  limit: number | null
}>
```

##### setTimeToLive

```ts
LoggerManager#PurgePolicy.setTimeToLive(id: string, val: number): Promise<void>
```

##### removeTimeToLive

```ts
LoggerManager#PurgePolicy.removeTimeToLive(id: string): Promise<void>
```

##### setLimit

```ts
LoggerManager#PurgePolicy.setLimit(id: string, val: boolean): Promise<void>
```

##### removeLimit

```ts
LoggerManager#PurgePolicy.removeLimit(id: string): Promise<void>
```

##### purge

```ts
LoggerManager#PurgePolicy.purge(id: string): Promise<void>
```

#### Blacklist

##### getIds

```ts
LoggerManager#Blacklist.getIds(): Promise<string[]>
```

##### add

```ts
LoggerManager#Blacklist.add(id: string): Promise<void>
```

##### remove

```ts
LoggerManager#Blacklist.remove(id: string): Promise<void>
```

#### Whitelist

##### getIds

```ts
LoggerManager#Whitelist.getIds(): Promise<string[]>
```

##### add

```ts
LoggerManager#Whitelist.add(id: string): Promise<void>
```

##### remove

```ts
LoggerManager#Whitelist.remove(id: string): Promise<void>
```

#### TokenPolicy

##### getIds

```ts
LoggerManager#TokenPolicy.getIds(): Promise<string[]>
```

##### get

```ts
LoggerManager#TokenPolicy.get(id: string): Promise<{
  writeTokenRequired: boolean | null
  readTokenRequired: boolean | null
  deleteTokenRequired: boolean | null
}>
```

##### setWriteTokenRequired

```ts
LoggerManager#TokenPolicy.setWriteTokenRequired(id: string, val: boolean): Promise<void>
```

##### removeWriteTokenRequired

```ts
LoggerManager#TokenPolicy.removeWriteTokenRequired(id: string): Promise<void>
```

##### setReadTokenRequired


```ts
LoggerManager#TokenPolicy.setReadTokenRequired(id: string, val: boolean): Promise<void>
```

##### removeReadTokenRequired

```ts
LoggerManager#TokenPolicy.removeReadTokenRequired(id: string): Promise<void>
```

##### setDeleteTokenRequired

```ts
LoggerManager#TokenPolicy.setDeleteTokenRequired(id: string, val: boolean): Promise<void>
```

##### removeDeleteTokenRequired

```ts
LoggerManager#TokenPolicy.removeDeleteTokenRequired(id: string): Promise<void>
```

#### Token

##### getIds

```ts
LoggerManager#Token.getIds(): Promise<string[]>
```

##### getTokens

```ts
LoggerManager#Token.getTokens(id: string): Promise<Array<{
  token: string
  write: boolean
  read: boolean
  delete: boolean
}>>
```

##### addWriteToken

```ts
LoggerManager#Token.addWriteToken(id: string, token: string): Promise<void>
```

##### removeWriteToken

```ts
LoggerManager#Token.removeWriteToken(id: string, token: string): Promise<void>
```

##### addReadToken

```ts
LoggerManager#Token.addReadToken(id: string, token: string): Promise<void>
```

##### removeReadToken

```ts
LoggerManager#Token.removeReadToken(id: string, token: string): Promise<void>
```

##### addDeleteToken

```ts
LoggerManager#Token.addDeleteToken(id: string, token: string): Promise<void>
```

##### removeDeleteToken

```ts
LoggerManager#Token.removeDeleteToken(id: string, token: string): Promise<void>
```
