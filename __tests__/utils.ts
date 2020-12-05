import { MockedRequest } from 'msw'

export const ADMIN_PASSWORD = 'password'
export const TOKEN = 'token'

export function badAuth(req: MockedRequest): boolean {
  return getPassword(req) !== ADMIN_PASSWORD

  function getPassword(req: MockedRequest) {
    const authorization = req.headers.get('Authorization')
    if (!authorization) return null
    const result = authorization.match(/^Bearer (\S+)$/)
    if (!result) return null
    return result[1]
  }
}

export function badJson(req: MockedRequest): boolean {
  const contentType = req.headers.get('Content-Type')
  if (contentType !== 'application/json') return true
  if (!req.body) return true
  return false
}

export function badText(req: MockedRequest): boolean {
  const contentType = req.headers.get('Content-Type')
  if (contentType !== 'application/x-www-form-urlencoded') return true
  if (!req.body) return true
  return false
}

export function badToken(req: MockedRequest): boolean {
  const token = req.url.searchParams.get('token')
  if (!token) return true
  if (token !== TOKEN) return true
  return false
}
