import { LoaderFunction } from 'react-router-dom'

export const composeLoaders = (...loaders: LoaderFunction[]): LoaderFunction => {
  return async (args) => {
    let lastResult: unknown = null

    for (const loader of loaders) {
      const result = await loader(args)

      if (result && typeof result === 'object' && 'status' in result && result.status === 302) {
        return result
      }

      lastResult = result
    }

    return lastResult
  }
}
