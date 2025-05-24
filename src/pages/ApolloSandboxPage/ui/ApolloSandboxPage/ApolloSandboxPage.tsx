import { ApolloSandbox } from '@apollo/sandbox/react'
import { Box } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { ApolloSandboxPageModel } from 'src/pages/ApolloSandboxPage/model/ApolloSandboxPageModel.ts'
import { useViewModel } from 'src/shared/lib'

export const ApolloSandboxPage = () => {
  const { '*': endpointPath = '' } = useParams()
  const model = useViewModel(ApolloSandboxPageModel)

  const url = `${model.baseUrl}/${endpointPath}`

  return (
    <Box
      w="100%"
      h="100%"
      css={{
        '& > div': { height: '100%' },
      }}
    >
      <ApolloSandbox
        initialEndpoint={url}
        initialState={{
          document: model.document,
          headers: { ...(model.token ? { Authorization: `Bearer ${model.token}` } : {}) },
        }}
      />
    </Box>
  )
}
