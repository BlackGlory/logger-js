import { Headers } from 'cross-fetch'
import { HTTPOptions, HTTPOptionsTransformer } from 'extra-request'
import { fromCode } from '@blackglory/http-status'
import { Json } from '@blackglory/types'
import { mapAsync } from 'iterable-operator'
import { TransformStream } from '@stardazed/streams'
import { TextDecoderStream } from '@stardazed/streams-text-encoding'
import { TextDecoder } from 'text-encoding'

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

export function checkHTTPStatus(res: Response): Response {
  if (!res.ok) throw fromCode(res.status)
  return res
}

export async function* toMultilines(res: Response): AsyncIterable<string> {
  // polyfill for TextDecoderStream
  globalThis.TransformStream = TransformStream
  globalThis.TextDecoder = TextDecoder

  const reader = res.body!
    // Cannot working because node-fetch body isnt a WHATWG ReadableStream
    .pipeThrough(new TextDecoderStream())
    .getReader()

  let buffer = ''
  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    let remains = value!
    while (remains.includes('\n')) {
      const newlinePos = remains.indexOf('\n')
      yield remains.slice(0, newlinePos)
      remains = remains.slice(newlinePos + 1)
    }
    buffer += value
  }
  if (buffer) yield buffer
}

export function toNDJSON(res: Response): AsyncIterable<Json> {
  return mapAsync(
    toMultilines(res)
  , text => JSON.parse(text)
  )
}

export function toJSON(res: Response): Promise<Json> {
  return res.json()
}

export function toText(res: Response): Promise<string> {
  return res.text()
}
