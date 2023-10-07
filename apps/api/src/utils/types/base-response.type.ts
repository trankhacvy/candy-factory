export interface BaseResponse<T> {
  statusCode: number;
  error?: string;
  data?: T;
}
