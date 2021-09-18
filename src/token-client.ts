import { fetch } from 'extra-fetch'
import { get, put, del } from 'extra-request'
import { pathname } from 'extra-request/transformers/index.js'
import { ok, toJSON } from 'extra-response'
import { ILoggerManagerRequestOptions, LoggerManagerBase } from './utils'

interface ITokenInfo {
  token: string
  write: boolean
  read: boolean
  delete: boolean
}

export class TokenClient extends LoggerManagerBase {
  async getNamespaces(options: ILoggerManagerRequestOptions = {}): Promise<string[]> {
    const req = get(
      ...this.getCommonTransformers(options)
    , pathname('/admin/logger-with-tokens')
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON) as string[]
  }

  async getTokens(
    namespace: string
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<ITokenInfo[]> {
    const req = get(
      ...this.getCommonTransformers(options)
    , pathname(`/admin/logger/${namespace}/tokens`)
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON) as ITokenInfo[]
  }

  async addWriteToken(
    namespace: string
  , token: string
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void> {
    const req = put(
      ...this.getCommonTransformers(options)
    , pathname(`/admin/logger/${namespace}/tokens/${token}/write`)
    )

    await fetch(req).then(ok)
  }

  async removeWriteToken(
    namespace: string
  , token: string
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void> {
    const req = del(
      ...this.getCommonTransformers(options)
    , pathname(`/admin/logger/${namespace}/tokens/${token}/write`)
    )

    await fetch(req).then(ok)
  }

  async addReadToken(
    namespace: string
  , token: string
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void> {
    const req = put(
      ...this.getCommonTransformers(options)
    , pathname(`/admin/logger/${namespace}/tokens/${token}/read`)
    )

    await fetch(req).then(ok)
  }

  async removeReadToken(
    namespace: string
  , token: string
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void> {
    const req = del(
      ...this.getCommonTransformers(options)
    , pathname(`/admin/logger/${namespace}/tokens/${token}/read`)
    )

    await fetch(req).then(ok)
  }

  async addDeleteToken(
    namespace: string
  , token: string
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void> {
    const req = put(
      ...this.getCommonTransformers(options)
    , pathname(`/admin/logger/${namespace}/tokens/${token}/delete`)
    )

    await fetch(req).then(ok)
  }

  async removeDeleteToken(
    namespace: string
  , token: string
  , options: ILoggerManagerRequestOptions = {}
  ): Promise<void> {
    const req = del(
      ...this.getCommonTransformers(options)
    , pathname(`/admin/logger/${namespace}/tokens/${token}/delete`)
    )

    await fetch(req).then(ok)
  }
}
