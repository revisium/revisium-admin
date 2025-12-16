import { Page } from '@playwright/test'

export type GraphQLHandler = {
  operationName: string
  response: object | ((variables: Record<string, unknown>) => object)
}

export async function mockGraphQL(page: Page, handlers: GraphQLHandler[]) {
  await page.route('**/graphql', async (route, request) => {
    const body = request.postDataJSON()
    const opName = body?.operationName as string
    const variables = body?.variables as Record<string, unknown>

    const handler = handlers.find((h) => h.operationName === opName)

    if (handler) {
      const response =
        typeof handler.response === 'function' ? handler.response(variables) : handler.response

      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response),
      })
    }

    console.warn(`[mock-graphql] Unhandled operation: ${opName}`)
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: null }),
    })
  })
}

export function graphqlError(message: string) {
  return { errors: [{ message }] }
}

export function graphqlData<T>(data: T) {
  return { data }
}
