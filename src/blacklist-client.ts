import { fetch } from 'extra-fetch'
import { get, put, del } from 'extra-request'
import { pathname } from 'extra-request/lib/es2018/transformers'
import { ok, toJSON } from 'extra-response'
import { ILoggerManagerRequestOptions, LoggerManagerBase } from './utils'

export class BlacklistClient extends LoggerManagerBase {
  async getNamespaces(options: ILoggerManagerRequestOptions = {}): Promise<string[]> {
    const req = get(
      ...this.getCommonTransformers(options)
    , pathname('/admin/blacklist')
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON) as string[]
  }

  async add(namespace: string, options: ILoggerManagerRequestOptions = {}): Promise<void> {
    const req = put(
      ...this.getCommonTransformers(options)
    , pathname(`/admin/blacklist/${namespace}`)
    )

    await fetch(req).then(ok)
  }

  async remove(namespace: string, options: ILoggerManagerRequestOptions = {}): Promise<void> {
    const req = del(
      ...this.getCommonTransformers(options)
    , pathname(`/admin/blacklist/${namespace}`)
    )

    await fetch(req).then(ok)
  }
}
