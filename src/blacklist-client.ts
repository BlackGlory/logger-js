import { fetch } from 'cross-fetch'
import { password } from './utils'
import { get, put, del } from 'extra-request'
import { url, pathname } from 'extra-request/lib/es2018/transformers'
import { ok, toJSON } from 'extra-response'

export interface BlacklistClientOptions {
  server: string
  adminPassword: string
}

export class BlacklistClient {
  constructor(private options: BlacklistClientOptions) {}

  async getIds(): Promise<string[]> {
    const req = get(
      url(this.options.server)
    , pathname('/api/blacklist')
    , password(this.options.adminPassword)
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON) as string[]
  }

  async add(id: string): Promise<void> {
    const req = put(
      url(this.options.server)
    , pathname(`/api/blacklist/${id}`)
    , password(this.options.adminPassword)
    )

    await fetch(req).then(ok)
  }

  async remove(id: string): Promise<void> {
    const req = del(
      url(this.options.server)
    , pathname(`/api/blacklist/${id}`)
    , password(this.options.adminPassword)
    )

    await fetch(req).then(ok)
  }
}
