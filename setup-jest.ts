jest.mock('src/shared/lib/getEnv', () => {
  return {
    getEnv: () => undefined,
  }
})
