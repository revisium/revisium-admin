import { Center, ChakraProvider, Spinner } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { ThemeProvider } from 'next-themes'
import { RouterProvider } from 'react-router-dom'
import { AppViewModel } from 'src/app/model/AppViewModel.ts'
import { system } from 'src/theme'

import { useViewModel } from 'src/shared/lib'
import { ToasterProvider } from 'src/shared/ui'

export const App: FC = observer(() => {
  const model = useViewModel(AppViewModel)

  if (!model.isLoaded || !model.router) {
    return (
      <ChakraProvider value={system}>
        <ThemeProvider attribute="class" forcedTheme="light" disableTransitionOnChange>
          <Center w="100%" h="100%">
            <Spinner />
          </Center>
          <ToasterProvider />
        </ThemeProvider>
      </ChakraProvider>
    )
  }

  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" forcedTheme="light" disableTransitionOnChange>
        <RouterProvider router={model.router} />
        <ToasterProvider />
      </ThemeProvider>
    </ChakraProvider>
  )
})
