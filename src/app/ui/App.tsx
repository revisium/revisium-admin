import { Center, ChakraProvider, Spinner } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { RouterProvider } from 'react-router-dom'
import { AppViewModel } from 'src/app/model/AppViewModel.ts'
import { GqlProvider } from 'src/entities/Gql'
import { system } from 'src/theme'

import { useViewModel } from 'src/shared/lib'
import { StandaloneToastContainer } from 'src/shared/ui'

export const App: FC = observer(() => {
  const model = useViewModel(AppViewModel)

  if (!model.isLoaded || !model.router) {
    return (
      <ChakraProvider value={system}>
        <Center w="100%" h="100%">
          <Spinner />
        </Center>
        <StandaloneToastContainer />
      </ChakraProvider>
    )
  }

  return (
    <GqlProvider>
      <ChakraProvider value={system}>
        <RouterProvider router={model.router} />
        <StandaloneToastContainer />
      </ChakraProvider>
    </GqlProvider>
  )
})
