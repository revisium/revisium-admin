import { ApolloProvider } from '@apollo/client'
import React from 'react'

import { apolloClient } from 'src/shared/lib/apolloClient'

export const GqlProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}
