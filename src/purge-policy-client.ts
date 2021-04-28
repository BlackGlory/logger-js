import { fetch } from 'extra-fetch'
import { password } from './utils'
import { get, put, del, post } from 'extra-request'
import { url, pathname, json, signal } from 'extra-request/lib/es2018/transformers'
import { ok, toJSON } from 'extra-response'
import type { ILoggerManagerOptions } from './logger-manager'
import { ILoggerManagerRequestOptions } from './types'

interface IPurgePolicy {
  timeToLive: number | null
  limit: number | null
}

export class PurgePolicyClient {
  constructor(private options: ILoggerManagerOptions) {}

  async getNamespaces(options: ILoggerManagerRequestOptions = {}): Promise<string[]> {
    const req = get(
      url(this.options.server)
    , pathname('/admin/logger-with-purge-policies')
    , password(this.options.adminPassword)
    , options.signal && signal(options.signal)
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
      url(this.options.server)
    , pathname(`/admin/logger/${namespace}/purge-policies`)
    , password(this.options.adminPassword)
    , options.signal && signal(options.signal)
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
      url(this.options.server)
    , pathname(`/admin/logger/${namespace}/purge-policies/time-to-live`)
    , password(this.options.adminPassword)
    , json(val)
    , options.signal && signal(options.signal)
    )

    await fetch(req).then(ok)
  }

  async removeTimeToLive(
    namespace: string
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void> {
    const req = del(
      url(this.options.server)
    , pathname(`/admin/logger/${namespace}/purge-policies/time-to-live`)
    , password(this.options.adminPassword)
    , options.signal && signal(options.signal)
    )

    await fetch(req).then(ok)
  }

  async setLimit(
    namespace: string
  , val: number
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void> {
    const req = put(
      url(this.options.server)
    , pathname(`/admin/logger/${namespace}/purge-policies/limit`)
    , password(this.options.adminPassword)
    , json(val)
    , options.signal && signal(options.signal)
    )

    await fetch(req).then(ok)
  }

  async removeLimit(
    namespace: string
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void> {
    const req = del(
      url(this.options.server)
    , pathname(`/admin/logger/${namespace}/purge-policies/limit`)
    , password(this.options.adminPassword)
    , options.signal && signal(options.signal)
    )

    await fetch(req).then(ok)
  }

  async purge(namespace: string, options: ILoggerManagerRequestOptions = {}): Promise<void> {
    const req = post(
      url(this.options.server)
    , pathname(`/admin/logger/${namespace}/purge-policies`)
    , password(this.options.adminPassword)
    , options.signal && signal(options.signal)
    )

    await fetch(req).then(ok)
  }
}
