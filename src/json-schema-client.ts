import { fetch } from 'cross-fetch'
import { Json } from '@blackglory/types'
import { password } from './utils'
import { get, put, del } from 'extra-request'
import { url, pathname, json, signal } from 'extra-request/lib/es2018/transformers'
import { ok, toJSON } from 'extra-response'
import type { LoggerManagerOptions } from './logger-manager'
import { LoggerManagerRequestOptions } from './types'

export class JsonSchemaClient {
  constructor(private options: LoggerManagerOptions) {}

  async getIds(options: LoggerManagerRequestOptions = {}): Promise<string[]> {
    const req = get(
      url(this.options.server)
    , pathname('/api/logger-with-json-schema')
    , password(this.options.adminPassword)
    , options.signal && signal(options.signal)
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON) as string[]
  }

  async get(id: string, options: LoggerManagerRequestOptions = {}): Promise<unknown> {
    const req = get(
      url(this.options.server)
    , pathname(`/api/logger/${id}/json-schema`)
    , password(this.options.adminPassword)
    , options.signal && signal(options.signal)
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON)
  }

  async set(id: string, schema: Json, options: LoggerManagerRequestOptions = {}): Promise<void> {
    const req = put(
      url(this.options.server)
    , pathname(`/api/logger/${id}/json-schema`)
    , password(this.options.adminPassword)
    , json(schema)
    , options.signal && signal(options.signal)
    )

    await fetch(req).then(ok)
  }

  async remove(id: string, options: LoggerManagerRequestOptions = {}): Promise<void> {
    const req = del(
      url(this.options.server)
    , pathname(`/api/logger/${id}/json-schema`)
    , password(this.options.adminPassword)
    , options.signal && signal(options.signal)
    )

    await fetch(req).then(ok)
  }
}
