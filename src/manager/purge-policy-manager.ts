import { fetch } from 'extra-fetch'
import { get, put, del, post } from 'extra-request'
import { appendPathname, json } from 'extra-request/transformers/index.js'
import { ok, toJSON } from 'extra-response'
import { ILoggerManagerRequestOptions, Base } from './base'

interface IPurgePolicy {
  timeToLive: number | null
  limit: number | null
}

export class PurgePolicyManager extends Base {
  /**
   * @throws {AbortError}
   */
  async getNamespaces(options: ILoggerManagerRequestOptions = {}): Promise<string[]> {
    const req = get(
      ...this.getCommonTransformers(options)
    , appendPathname('/admin/logger-with-purge-policies')
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON) as string[]
  }

  /**
   * @throws {AbortError}
   */
  async get(
    namespace: string
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<IPurgePolicy> {
    const req = get(
      ...this.getCommonTransformers(options)
    , appendPathname(`/admin/logger/${namespace}/purge-policies`)
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON) as IPurgePolicy
  }

  /**
   * @throws {AbortError}
   */
  async setTimeToLive(
    namespace: string
  , val: number
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void> {
    const req = put(
      ...this.getCommonTransformers(options)
    , appendPathname(`/admin/logger/${namespace}/purge-policies/time-to-live`)
    , json(val)
    )

    await fetch(req).then(ok)
  }

  /**
   * @throws {AbortError}
   */
  async removeTimeToLive(
    namespace: string
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void> {
    const req = del(
      ...this.getCommonTransformers(options)
    , appendPathname(`/admin/logger/${namespace}/purge-policies/time-to-live`)
    )

    await fetch(req).then(ok)
  }

  /**
   * @throws {AbortError}
   */
  async setLimit(
    namespace: string
  , val: number
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void> {
    const req = put(
      ...this.getCommonTransformers(options)
    , appendPathname(`/admin/logger/${namespace}/purge-policies/limit`)
    , json(val)
    )

    await fetch(req).then(ok)
  }

  /**
   * @throws {AbortError}
   */
  async removeLimit(
    namespace: string
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void> {
    const req = del(
      ...this.getCommonTransformers(options)
    , appendPathname(`/admin/logger/${namespace}/purge-policies/limit`)
    )

    await fetch(req).then(ok)
  }

  /**
   * @throws {AbortError}
   */
  async purge(namespace: string, options: ILoggerManagerRequestOptions = {}): Promise<void> {
    const req = post(
      ...this.getCommonTransformers(options)
    , appendPathname(`/admin/logger/${namespace}/purge-policies`)
    )

    await fetch(req).then(ok)
  }
}
