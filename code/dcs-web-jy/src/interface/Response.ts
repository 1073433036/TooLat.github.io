export interface Response<T> {
  result: string,
  description: string,
  tagObject: TagObject<T>
}

interface TagObject<T> {
  ROWCOUNT: string,
  DATA: Array<T>
}

export interface ResponseLite<T> {
  result: string,
  description: string,
  tagObject: Array<T>
}