import { fetch } from 'cross-fetch'
import { password, checkHTTPStatus, toJSON } from './utils'
import { get, put, del } from 'extra-request'
import { url, pathname, json } from 'extra-request/lib/es2018/transformers'

interface TokenPolicy {
  writeTokenRequired: boolean | null
  readTokenRequired: boolean | null
  deleteTokenRequired: boolean | null
}

export interface TokenPolicyClientOptions {
  server: string
  adminPassword: string
}

export class TokenPolicyClient {
  constructor(private options: TokenPolicyClientOptions) {}

  async getIds(): Promise<string[]> {
    const req = get(
      url(this.options.server)
    , pathname('/api/logger-with-token-policies')
    , password(this.options.adminPassword)
    )

    return await fetch(req)
      .then(checkHTTPStatus)
      .then(toJSON) as string[]
  }

  async get(id: string): Promise<TokenPolicy> {
    const req = get(
      url(this.options.server)
    , pathname(`/api/logger/${id}/token-policies`)
    , password(this.options.adminPassword)
    )

    return await fetch(req)
      .then(checkHTTPStatus)
      .then(toJSON) as TokenPolicy
  }

  async setWriteTokenRequired(id: string, val: boolean): Promise<void> {
    const req = put(
      url(this.options.server)
    , pathname(`/api/logger/${id}/token-policies/write-token-required`)
    , password(this.options.adminPassword)
    , json(val)
    )

    await fetch(req)
      .then(checkHTTPStatus)
  }

  async removeWriteTokenRequired(id: string): Promise<void> {
    const req = del(
      url(this.options.server)
    , pathname(`/api/logger/${id}/token-policies/write-token-required`)
    , password(this.options.adminPassword)
    )

    await fetch(req)
      .then(checkHTTPStatus)
  }

  async setReadTokenRequired(id: string, val: boolean): Promise<void> {
    const req = put(
      url(this.options.server)
    , pathname(`/api/logger/${id}/token-policies/read-token-required`)
    , password(this.options.adminPassword)
    , json(val)
    )

    await fetch(req)
      .then(checkHTTPStatus)
  }

  async removeReadTokenRequired(id: string): Promise<void> {
    const req = del(
      url(this.options.server)
    , pathname(`/api/logger/${id}/token-policies/read-token-required`)
    , password(this.options.adminPassword)
    )

    await fetch(req)
      .then(checkHTTPStatus)
  }

  async setDeleteTokenRequired(id: string, val: boolean): Promise<void> {
    const req = put(
      url(this.options.server)
    , pathname(`/api/logger/${id}/token-policies/delete-token-required`)
    , password(this.options.adminPassword)
    , json(val)
    )

    await fetch(req)
      .then(checkHTTPStatus)
  }

  async removeDeleteTokenRequired(id: string): Promise<void> {
    const req = del(
      url(this.options.server)
    , pathname(`/api/logger/${id}/token-policies/delete-token-required`)
    , password(this.options.adminPassword)
    )

    await fetch(req)
      .then(checkHTTPStatus)
  }
}
