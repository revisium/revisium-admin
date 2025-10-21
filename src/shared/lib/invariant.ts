export function invariant<T>(value: T, message = 'Invariant failed'): asserts value is NonNullable<T> {
  if (value == null) {
    throw new Error(message)
  }
}
