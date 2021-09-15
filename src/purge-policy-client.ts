import { fetch } from 'extra-fetch'
import { get, put, del, post } from 'extra-request'
import { pathname, json } from 'extra-request/lib/es2018/transformers'
import { ok, toJSON } from 'extra-response'
import { ILoggerManagerRequestOptions, LoggerManagerBase } from './utils'

interface IPurgePolicy {
  timeToLive: number | null
  limit: number | null
}

export class PurgePolicyClient extends LoggerManagerBase {
  async getNamespaces(options: ILoggerManagerRequestOptions = {}): Promise<string[]> {
    const req = get(
      ...this.getCommonTransformers(options)
    , pathname('/admin/logger-with-purge-policies')
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON) as string[]
  }

  async get(
    namespace: string
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<IPurgePolicy> {
    const req = get(
      ...this.getCommonTransformers(options)
    , pathname(`/admin/logger/${namespace}/purge-policies`)
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON) as IPurgePolicy
  }

  async setTimeToLive(
    namespace: string
  , val: number
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void> {
    const req = put(
      ...this.getCommonTransformers(options)
    , pathname(`/admin/logger/${namespace}/purge-policies/time-to-live`)
    , json(val)
    )

    await fetch(req).then(ok)
  }

  async removeTimeToLive(
    namespace: string
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void> {
    const req = del(
      ...this.getCommonTransformers(options)
    , pathname(`/admin/logger/${namespace}/purge-policies/time-to-live`)
    )

    await fetch(req).then(ok)
  }

  async setLimit(
    namespace: string
  , val: number
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void> {
    const req = put(
      ...this.getCommonTransformers(options)
    , pathname(`/admin/logger/${namespace}/purge-policies/limit`)
    , json(val)
    )

    await fetch(req).then(ok)
  }

  async removeLimit(
    namespace: string
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void> {
    const req = del(
      ...this.getCommonTransformers(options)
    , pathname(`/admin/logger/${namespace}/purge-policies/limit`)
    )

    await fetch(req).then(ok)
  }

  async purge(namespace: string, options: ILoggerManagerRequestOptions = {}): Promise<void> {
    const req = post(
      ...this.getCommonTransformers(options)
    , pathname(`/admin/logger/${namespace}/purge-policies`)
    )

    await fetch(req).then(ok)
  }
}
