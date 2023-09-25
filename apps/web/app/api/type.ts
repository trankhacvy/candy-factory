export interface BaseResponse<T> {
  success: boolean
  error?: string
  data?: T
}
