jest.mock('src/shared/lib/getEnv', () => {
  return {
    getEnv: () => undefined,
  }
})

jest.mock('src/shared/env/getEnv', () => {
  return {
    getEnv: () => '/endpoint',
  }
})
