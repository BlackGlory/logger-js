import { fetch } from 'cross-fetch'
import { password, checkHTTPStatus, toJSON } from './utils'
import { get, put, del } from 'extra-request'
import { url, pathname } from 'extra-request/lib/es2018/transformers'

interface TokenInfo {
  token: string
  write: boolean
  read: boolean
  delete: boolean
}

export interface TokenClientOptions {
  server: string
  adminPassword: string
}

export class TokenClient {
  constructor(private options: TokenClientOptions) {}

  async getIds(): Promise<string[]> {
    const req = get(
      url(this.options.server)
    , pathname('/api/logger-with-tokens')
    , password(this.options.adminPassword)
    )

    return await fetch(req)
      .then(checkHTTPStatus)
      .then(toJSON) as string[]
  }

  async getTokens(id: string): Promise<TokenInfo[]> {
    const req = get(
      url(this.options.server)
    , pathname(`/api/logger/${id}/tokens`)
    , password(this.options.adminPassword)
    )

    return await fetch(req)
      .then(checkHTTPStatus)
      .then(toJSON) as TokenInfo[]
  }

  async addWriteToken(id: string, token: string): Promise<void> {
    const req = put(
      url(this.options.server)
    , pathname(`/api/logger/${id}/tokens/${token}/write`)
    , password(this.options.adminPassword)
    )

    await fetch(req)
      .then(checkHTTPStatus)
  }

  async removeWriteToken(id: string, token: string): Promise<void> {
    const req = del(
      url(this.options.server)
    , pathname(`/api/logger/${id}/tokens/${token}/write`)
    , password(this.options.adminPassword)
    )

    await fetch(req)
      .then(checkHTTPStatus)
  }

  async addReadToken(id: string, token: string): Promise<void> {
    const req = put(
      url(this.options.server)
    , pathname(`/api/logger/${id}/tokens/${token}/read`)
    , password(this.options.adminPassword)
    )

    await fetch(req)
      .then(checkHTTPStatus)
  }

  async removeReadToken(id: string, token: string): Promise<void> {
    const req = del(
      url(this.options.server)
    , pathname(`/api/logger/${id}/tokens/${token}/read`)
    , password(this.options.adminPassword)
    )

    await fetch(req)
      .then(checkHTTPStatus)
  }

  async addDeleteToken(id: string, token: string): Promise<void> {
    const req = put(
      url(this.options.server)
    , pathname(`/api/logger/${id}/tokens/${token}/delete`)
    , password(this.options.adminPassword)
    )

    await fetch(req)
      .then(checkHTTPStatus)
  }

  async removeDeleteToken(id: string, token: string): Promise<void> {
    const req = del(
      url(this.options.server)
    , pathname(`/api/logger/${id}/tokens/${token}/delete`)
    , password(this.options.adminPassword)
    )

    await fetch(req)
      .then(checkHTTPStatus)
  }
}
