import { ApiKeyManagerDataSource } from './ApiKeyManagerDataSource.ts'
import { ApiKeyManagerViewModel } from './ApiKeyManagerViewModel.ts'

function createDataSource(overrides: Partial<ApiKeyManagerDataSource> = {}): ApiKeyManagerDataSource {
  return {
    get isLoading() {
      return false
    },
    get error() {
      return null
    },
    get isMutating() {
      return false
    },
    fetchPersonalKeys: jest.fn(),
    fetchServiceKeys: jest.fn(),
    createPersonalKey: jest.fn(),
    createServiceKey: jest.fn(),
    revokeKey: jest.fn(),
    rotateKey: jest.fn(),
    dispose: jest.fn(),
    ...overrides,
  } as unknown as ApiKeyManagerDataSource
}

describe('ApiKeyManagerViewModel', () => {
  it('marks the list loaded and exposes an error when loading keys throws unexpectedly', async () => {
    const error = new Error('Failed unexpectedly')
    const dataSource = createDataSource({
      fetchPersonalKeys: jest.fn().mockRejectedValue(error),
    })
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)
    const model = new ApiKeyManagerViewModel(dataSource)

    try {
      await model.loadKeys().catch(model.handleLoadKeysError)

      expect(model.isLoaded).toBe(true)
      expect(model.error).toBe(error.message)
      expect(consoleErrorSpy).toHaveBeenCalledWith(error)
    } finally {
      consoleErrorSpy.mockRestore()
    }
  })
})
