/**
 * Promise<T>の値とReject時のエラーを合わせた汎用的なPromiseの型を示します。
 */
export type PromiseResult<T> = {
  value?: T
  error?: Error
}
