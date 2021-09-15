import { JsonSchemaClient } from './json-schema-client'
import { BlacklistClient } from './blacklist-client'
import { WhitelistClient } from './whitelist-client'
import { TokenPolicyClient } from './token-policy-client'
import { TokenClient } from './token-client'
import { PurgePolicyClient } from './purge-policy-client'

export interface ILoggerManagerOptions {
  server: string
  adminPassword: string
  keepalive?: boolean
  timeout?: number
}

export class LoggerManager {
  constructor(private options: ILoggerManagerOptions) {}

  JsonSchema = new JsonSchemaClient(this.options)
  Blacklist = new BlacklistClient(this.options)
  Whitelist = new WhitelistClient(this.options)
  TokenPolicy = new TokenPolicyClient(this.options)
  Token = new TokenClient(this.options)
  PurgePolicy = new PurgePolicyClient(this.options)
}
