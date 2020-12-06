import { fetch } from 'cross-fetch'
import { Json } from '@blackglory/types'
import { password } from './utils'
import { get, put, del } from 'extra-request'
import { url, pathname, json } from 'extra-request/lib/es2018/transformers'
import { ok, toJSON } from 'extra-response'

export interface JsonSchemaClientOptions {
  server: string
  adminPassword: string
}

export class JsonSchemaClient {
  constructor(private options: JsonSchemaClientOptions) {}

  async getIds(): Promise<string[]> {
    const req = get(
      url(this.options.server)
    , pathname('/api/logger-with-json-schema')
    , password(this.options.adminPassword)
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON) as string[]
  }

  async get(id: string): Promise<Json> {
    const req = get(
      url(this.options.server)
    , pathname(`/api/logger/${id}/json-schema`)
    , password(this.options.adminPassword)
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON)
  }

  async set(id: string, schema: Json): Promise<void> {
    const req = put(
      url(this.options.server)
    , pathname(`/api/logger/${id}/json-schema`)
    , password(this.options.adminPassword)
    , json(schema)
    )

    await fetch(req).then(ok)
  }

  async remove(id: string): Promise<void> {
    const req = del(
      url(this.options.server)
    , pathname(`/api/logger/${id}/json-schema`)
    , password(this.options.adminPassword)
    )

    await fetch(req).then(ok)
  }
}
