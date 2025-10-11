export type Right<T> = {
  isRight: true
  data: T
}

export type Left<E> = {
  isRight: false
  error: E
}

export type Either<E, T> = Left<E> | Right<T>

export function isRight<E, T>(res: Either<E, T>): res is Right<T> {
  return res.isRight === true
}

export function isLeft<E, T>(res: Either<E, T>): res is Left<E> {
  return res.isRight === false
}
