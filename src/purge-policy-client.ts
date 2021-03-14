import { fetch } from 'extra-fetch'
import { password } from './utils'
import { get, put, del, post } from 'extra-request'
import { url, pathname, json, signal } from 'extra-request/lib/es2018/transformers'
import { ok, toJSON } from 'extra-response'
import type { ILoggerManagerOptions } from './logger-manager'
import { LoggerManagerRequestOptions } from './types'

interface PurgePolicy {
  timeToLive: number | null
  limit: number | null
}

export class PurgePolicyClient {
  constructor(private options: ILoggerManagerOptions) {}

  async getIds(options: LoggerManagerRequestOptions = {}): Promise<string[]> {
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

  async get(id: string, options: LoggerManagerRequestOptions = {}): Promise<PurgePolicy> {
    const req = get(
      url(this.options.server)
    , pathname(`/admin/logger/${id}/purge-policies`)
    , password(this.options.adminPassword)
    , options.signal && signal(options.signal)
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON) as PurgePolicy
  }

  async setTimeToLive(id: string, val: number, options: LoggerManagerRequestOptions = {}): Promise<void> {
    const req = put(
      url(this.options.server)
    , pathname(`/admin/logger/${id}/purge-policies/time-to-live`)
    , password(this.options.adminPassword)
    , json(val)
    , options.signal && signal(options.signal)
    )

    await fetch(req).then(ok)
  }

  async removeTimeToLive(id: string, options: LoggerManagerRequestOptions = {}): Promise<void> {
    const req = del(
      url(this.options.server)
    , pathname(`/admin/logger/${id}/purge-policies/time-to-live`)
    , password(this.options.adminPassword)
    , options.signal && signal(options.signal)
    )

    await fetch(req).then(ok)
  }

  async setLimit(id: string, val: number, options: LoggerManagerRequestOptions = {}): Promise<void> {
    const req = put(
      url(this.options.server)
    , pathname(`/admin/logger/${id}/purge-policies/limit`)
    , password(this.options.adminPassword)
    , json(val)
    , options.signal && signal(options.signal)
    )

    await fetch(req).then(ok)
  }

  async removeLimit(id: string, options: LoggerManagerRequestOptions = {}): Promise<void> {
    const req = del(
      url(this.options.server)
    , pathname(`/admin/logger/${id}/purge-policies/limit`)
    , password(this.options.adminPassword)
    , options.signal && signal(options.signal)
    )

    await fetch(req).then(ok)
  }

  async purge(id: string, options: LoggerManagerRequestOptions = {}): Promise<void> {
    const req = post(
      url(this.options.server)
    , pathname(`/admin/logger/${id}/purge-policies`)
    , password(this.options.adminPassword)
    , options.signal && signal(options.signal)
    )

    await fetch(req).then(ok)
  }
}
