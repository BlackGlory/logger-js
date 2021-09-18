import { IHTTPOptionsTransformer } from 'extra-request'
import { url, signal, keepalive, bearerAuth } from 'extra-request/transformers/index.js'
import { timeoutSignal, raceAbortSignals } from 'extra-promise'
import type { ILoggerManagerOptions } from './logger-manager'

export interface ILoggerManagerRequestOptions {
  signal?: AbortSignal
  keepalive?: boolean
  timeout?: number | false
}

export class LoggerManagerBase {
  constructor(private options: ILoggerManagerOptions) {}

  protected getCommonTransformers(
    options: ILoggerManagerRequestOptions
  ): IHTTPOptionsTransformer[] {
    return [
      url(this.options.server)
    , bearerAuth(this.options.adminPassword)
    , signal(raceAbortSignals([
        options.signal
      , options.timeout !== false && (
          (options.timeout && timeoutSignal(options.timeout)) ??
          (this.options.timeout && timeoutSignal(this.options.timeout))
        )
      ]))
    , keepalive(options.keepalive ?? this.options.keepalive)
    ]
  }
}
