import { HttpRequest } from '@azure/functions'

/**
 * 引数に与えられたHttpRequestからクエリの値を取得します。
 * @param req クエリを取得する対象のHttpRequest
 * @param queryName クエリ名
 */
export const getQuery = (req: HttpRequest, queryName: string): string => {
  return req.query[queryName] || (req.body && req.body[queryName])
}
