import { Headers } from 'extra-fetch'
import { HTTPOptions, HTTPOptionsTransformer } from 'extra-request'

export function password(password: string): HTTPOptionsTransformer {
  return (options: HTTPOptions) => {
    const headers = new Headers(options.headers)
    headers.set('Authorization', `Bearer ${password}`)
    return {
      ...options
    , headers
    }
  }
}
