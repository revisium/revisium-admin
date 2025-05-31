import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { getEnv } from 'src/shared/lib/getEnv.ts'
import { toaster } from 'src/shared/ui'

const httpLink = createHttpLink({ uri: getEnv('REACT_APP_GRAPHQL_SERVER_URL') })

const auth = setContext(async () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
}))

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      toaster.info({
        duration: 3000,
        description: err.message,
      })
    }
  }
})

export const apolloClient = new ApolloClient({
  connectToDevTools: true,
  link: from([auth, errorLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      TableModel: {
        keyFields: ['versionId'],
      },
      RowModel: {
        keyFields: ['versionId'],
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
})

export const apolloCache = apolloClient.cache
