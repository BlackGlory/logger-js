import { fetch } from 'cross-fetch'
import { password } from './utils'
import { get, put, del, post } from 'extra-request'
import { url, pathname, json } from 'extra-request/lib/es2018/transformers'
import { ok, toJSON } from 'extra-response'

interface PurgePolicy {
  timeToLive: number | null
  limit: number | null
}

export interface PurgePolicyClientOptions {
  server: string
  adminPassword: string
}

export class PurgePolicyClient {
  constructor(private options: PurgePolicyClientOptions) {}

  async getIds(): Promise<string[]> {
    const req = get(
      url(this.options.server)
    , pathname('/api/logger-with-purge-policies')
    , password(this.options.adminPassword)
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON) as string[]
  }

  async get(id: string): Promise<PurgePolicy> {
    const req = get(
      url(this.options.server)
    , pathname(`/api/logger/${id}/purge-policies`)
    , password(this.options.adminPassword)
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON) as PurgePolicy
  }

  async setTimeToLive(id: string, val: number): Promise<void> {
    const req = put(
      url(this.options.server)
    , pathname(`/api/logger/${id}/purge-policies/time-to-live`)
    , password(this.options.adminPassword)
    , json(val)
    )

    await fetch(req).then(ok)
  }

  async removeTimeToLive(id: string): Promise<void> {
    const req = del(
      url(this.options.server)
    , pathname(`/api/logger/${id}/purge-policies/time-to-live`)
    , password(this.options.adminPassword)
    )

    await fetch(req).then(ok)
  }

  async setLimit(id: string, val: number): Promise<void> {
    const req = put(
      url(this.options.server)
    , pathname(`/api/logger/${id}/purge-policies/limit`)
    , password(this.options.adminPassword)
    , json(val)
    )

    await fetch(req).then(ok)
  }

  async removeLimit(id: string): Promise<void> {
    const req = del(
      url(this.options.server)
    , pathname(`/api/logger/${id}/purge-policies/limit`)
    , password(this.options.adminPassword)
    )

    await fetch(req).then(ok)
  }

  async purge(id: string): Promise<void> {
    const req = post(
      url(this.options.server)
    , pathname(`/api/logger/${id}/purge-policies`)
    , password(this.options.adminPassword)
    )

    await fetch(req).then(ok)
  }
}
