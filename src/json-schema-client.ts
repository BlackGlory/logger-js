import { fetch } from 'extra-fetch'
import { Json } from 'justypes'
import { get, put, del } from 'extra-request'
import { pathname, json } from 'extra-request/transformers/index.js'
import { ok, toJSON } from 'extra-response'
import { ILoggerManagerRequestOptions, LoggerManagerBase } from './utils'

export class JsonSchemaClient extends LoggerManagerBase {
  async getNamespaces(options: ILoggerManagerRequestOptions = {}): Promise<string[]> {
    const req = get(
      ...this.getCommonTransformers(options)
    , pathname('/admin/logger-with-json-schema')
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON) as string[]
  }

  async get(namespace: string, options: ILoggerManagerRequestOptions = {}): Promise<unknown> {
    const req = get(
      ...this.getCommonTransformers(options)
    , pathname(`/admin/logger/${namespace}/json-schema`)
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON)
  }

  async set(
    namespace: string
  , schema: Json
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void> {
    const req = put(
      ...this.getCommonTransformers(options)
    , pathname(`/admin/logger/${namespace}/json-schema`)
    , json(schema)
    )

    await fetch(req).then(ok)
  }

  async remove(namespace: string, options: ILoggerManagerRequestOptions = {}): Promise<void> {
    const req = del(
      ...this.getCommonTransformers(options)
    , pathname(`/admin/logger/${namespace}/json-schema`)
    )

    await fetch(req).then(ok)
  }
}
