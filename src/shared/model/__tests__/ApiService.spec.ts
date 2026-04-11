import { ClientError } from 'graphql-request'
import { ApiService } from 'src/shared/model/ApiService.ts'
import { EnvironmentService } from 'src/shared/model/EnvironmentService.ts'

const mockRequest = jest.fn()
const mockSetHeaders = jest.fn()

jest.mock('graphql-request', () => {
  const actual = jest.requireActual('graphql-request')
  return {
    ...actual,
    GraphQLClient: jest.fn().mockImplementation(() => ({
      request: mockRequest,
      setHeaders: mockSetHeaders,
    })),
  }
})

jest.mock('src/__generated__/graphql-request.ts', () => ({
  getSdk: jest.fn(() => ({})),
}))

jest.mock('src/shared/ui', () => ({
  toaster: {
    info: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  },
}))

jest.mock('src/shared/lib', () => ({
  container: {
    register: jest.fn(),
    get: jest.fn(() => ({ client: {} })),
  },
}))

type MinimalRequest = (document: unknown, variables?: unknown, headers?: Record<string, string>) => Promise<unknown>

type ErrorShape = {
  status?: number
  errors?: Array<Record<string, unknown>>
  data?: unknown
}

function makeClientError({ status = 200, errors, data = null }: ErrorShape): ClientError {
  return new ClientError(
    {
      status,
      errors: errors as never,
      data: data as never,
    },
    { query: '{ me { id } }' },
  )
}

function getWrappedRequest(service: ApiService): MinimalRequest {
  return (service as unknown as { graphQLClient: { request: MinimalRequest } }).graphQLClient.request
}

describe('ApiService', () => {
  let envService: EnvironmentService
  let service: ApiService

  beforeEach(() => {
    mockRequest.mockReset()
    mockSetHeaders.mockReset()

    envService = {
      get: jest.fn().mockReturnValue('/graphql'),
    } as unknown as EnvironmentService

    service = new ApiService(envService)
  })

  describe('isUnauthorized detection', () => {
    const TRIGGERS_REFRESH = [
      {
        name: 'HTTP 401 (REST-style)',
        shape: { status: 401, errors: [{ message: 'Unauthorized' }] },
      },
      {
        name: 'HTTP 200 + errors[0].message = "Unauthorized" (Yoga/Nest default)',
        shape: { status: 200, errors: [{ message: 'Unauthorized' }] },
      },
      {
        name: 'HTTP 200 + errors[0].message = "unauthorized" (case-insensitive)',
        shape: { status: 200, errors: [{ message: 'unauthorized' }] },
      },
      {
        name: 'HTTP 200 + errors[0].extensions.code = "UNAUTHENTICATED"',
        shape: {
          status: 200,
          errors: [{ message: 'Access denied', extensions: { code: 'UNAUTHENTICATED' } }],
        },
      },
      {
        name: 'HTTP 200 + errors[0].extensions.originalError.statusCode = 401',
        shape: {
          status: 200,
          errors: [{ message: 'Forbidden', extensions: { originalError: { statusCode: 401 } } }],
        },
      },
    ]

    it.each(TRIGGERS_REFRESH)('triggers refresh handler for: $name', async ({ shape }) => {
      const onUnauthorized = jest.fn().mockResolvedValue(true)
      service.setUnauthorizedHandler(onUnauthorized)

      mockRequest.mockRejectedValueOnce(makeClientError(shape))
      mockRequest.mockResolvedValueOnce({ me: { id: 'admin' } })

      const result = await getWrappedRequest(service)('{ me { id } }')

      expect(onUnauthorized).toHaveBeenCalledTimes(1)
      expect(mockRequest).toHaveBeenCalledTimes(2)
      expect(result).toEqual({ me: { id: 'admin' } })
    })

    const DOES_NOT_TRIGGER = [
      {
        name: 'HTTP 500 internal error',
        shape: { status: 500, errors: [{ message: 'Internal server error' }] },
      },
      {
        name: 'HTTP 200 + errors[0].message = "Rate limited"',
        shape: { status: 200, errors: [{ message: 'Rate limited' }] },
      },
      {
        name: 'HTTP 200 + errors[0].message = "Validation failed"',
        shape: { status: 200, errors: [{ message: 'Validation failed' }] },
      },
      {
        name: 'HTTP 400 bad request',
        shape: { status: 400, errors: [{ message: 'Bad request' }] },
      },
      {
        name: 'HTTP 200 + errors[0].extensions.code = "FORBIDDEN"',
        shape: {
          status: 200,
          errors: [{ message: 'Forbidden', extensions: { code: 'FORBIDDEN' } }],
        },
      },
      {
        name: 'HTTP 200 + no errors array',
        shape: { status: 200, errors: undefined },
      },
    ]

    it.each(DOES_NOT_TRIGGER)('does not trigger refresh for: $name', async ({ shape }) => {
      const onUnauthorized = jest.fn().mockResolvedValue(true)
      service.setUnauthorizedHandler(onUnauthorized)

      mockRequest.mockRejectedValueOnce(makeClientError(shape))

      await expect(getWrappedRequest(service)('{ me { id } }')).rejects.toBeInstanceOf(ClientError)
      expect(onUnauthorized).not.toHaveBeenCalled()
      expect(mockRequest).toHaveBeenCalledTimes(1)
    })

    it('does not treat non-ClientError exceptions as unauthorized', async () => {
      const onUnauthorized = jest.fn().mockResolvedValue(true)
      service.setUnauthorizedHandler(onUnauthorized)

      const networkError = new Error('fetch failed')
      mockRequest.mockRejectedValueOnce(networkError)

      await expect(getWrappedRequest(service)('{ me { id } }')).rejects.toBe(networkError)
      expect(onUnauthorized).not.toHaveBeenCalled()
    })
  })

  describe('retry behavior', () => {
    it('retries the original request with the same arguments when refresh succeeds', async () => {
      const onUnauthorized = jest.fn().mockResolvedValue(true)
      service.setUnauthorizedHandler(onUnauthorized)

      mockRequest.mockRejectedValueOnce(makeClientError({ status: 200, errors: [{ message: 'Unauthorized' }] }))
      mockRequest.mockResolvedValueOnce({ data: 'fresh' })

      const doc = '{ getProject(id: "x") { id } }'
      const vars = { id: 'x' }
      const headers = { 'X-Foo': 'bar' }

      const result = await getWrappedRequest(service)(doc, vars, headers)

      expect(result).toEqual({ data: 'fresh' })
      expect(mockRequest).toHaveBeenCalledTimes(2)
      expect(mockRequest).toHaveBeenNthCalledWith(1, doc, vars, headers)
      expect(mockRequest).toHaveBeenNthCalledWith(2, doc, vars, headers)
    })

    it('throws the original error when refresh handler returns false', async () => {
      const onUnauthorized = jest.fn().mockResolvedValue(false)
      service.setUnauthorizedHandler(onUnauthorized)

      const clientError = makeClientError({ status: 200, errors: [{ message: 'Unauthorized' }] })
      mockRequest.mockRejectedValueOnce(clientError)

      await expect(getWrappedRequest(service)('{ me { id } }')).rejects.toBe(clientError)
      expect(onUnauthorized).toHaveBeenCalledTimes(1)
      expect(mockRequest).toHaveBeenCalledTimes(1)
    })

    it('throws the original error when no unauthorized handler is registered', async () => {
      const clientError = makeClientError({ status: 200, errors: [{ message: 'Unauthorized' }] })
      mockRequest.mockRejectedValueOnce(clientError)

      await expect(getWrappedRequest(service)('{ me { id } }')).rejects.toBe(clientError)
      expect(mockRequest).toHaveBeenCalledTimes(1)
    })

    it('caps at one retry — a second 401 after refresh bubbles up', async () => {
      const onUnauthorized = jest.fn().mockResolvedValue(true)
      service.setUnauthorizedHandler(onUnauthorized)

      const firstError = makeClientError({ status: 200, errors: [{ message: 'Unauthorized' }] })
      const secondError = makeClientError({ status: 200, errors: [{ message: 'Unauthorized' }] })
      mockRequest.mockRejectedValueOnce(firstError)
      mockRequest.mockRejectedValueOnce(secondError)

      await expect(getWrappedRequest(service)('{ me { id } }')).rejects.toBe(secondError)
      expect(onUnauthorized).toHaveBeenCalledTimes(1)
      expect(mockRequest).toHaveBeenCalledTimes(2)
    })

    it('passes successful requests through unchanged', async () => {
      const onUnauthorized = jest.fn().mockResolvedValue(true)
      service.setUnauthorizedHandler(onUnauthorized)

      mockRequest.mockResolvedValueOnce({ me: { id: 'admin' } })

      const result = await getWrappedRequest(service)('{ me { id } }')

      expect(result).toEqual({ me: { id: 'admin' } })
      expect(onUnauthorized).not.toHaveBeenCalled()
      expect(mockRequest).toHaveBeenCalledTimes(1)
    })
  })

  describe('setToken', () => {
    it('forwards Authorization header when token is provided', () => {
      service.setToken('jwt-value')
      expect(mockSetHeaders).toHaveBeenCalledWith({ Authorization: 'Bearer jwt-value' })
    })

    it('clears headers when token is null', () => {
      service.setToken(null)
      expect(mockSetHeaders).toHaveBeenCalledWith({})
    })
  })
})
