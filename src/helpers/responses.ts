export interface Ok<T> {
  value: T;
  error: null;
}

export interface Err {
  value: null;
  error: string;
}

export type ApiResponse<T> = Ok<T> | Err;

export class OkResponse<T> implements Ok<T> {
  public error = null;
  public constructor(public readonly value: T) {}
}

export class ErrorResponse implements Err {
  public readonly value = null;
  public constructor(public readonly error: string) {}
}
