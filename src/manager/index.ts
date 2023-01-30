import { JsonSchemaManager } from './json-schema-manager.js'
import { BlacklistManager } from './blacklist-manager.js'
import { WhitelistManager } from './whitelist-manager.js'
import { TokenPolicyManager } from './token-policy-manager.js'
import { TokenManager } from './token-manager.js'
import { PurgePolicyManager } from './purge-policy-manager.js'

export interface ILoggerManagerOptions {
  server: string
  adminPassword: string
  keepalive?: boolean
  timeout?: number
}

export class LoggerManager {
  constructor(private options: ILoggerManagerOptions) {}

  JsonSchema = new JsonSchemaManager(this.options)
  Blacklist = new BlacklistManager(this.options)
  Whitelist = new WhitelistManager(this.options)
  TokenPolicy = new TokenPolicyManager(this.options)
  Token = new TokenManager(this.options)
  PurgePolicy = new PurgePolicyManager(this.options)
}
