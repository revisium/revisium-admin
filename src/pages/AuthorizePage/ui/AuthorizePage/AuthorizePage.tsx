import { Box, Button, Flex, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { useCallback } from 'react'
import { AuthorizePageViewModel } from 'src/pages/AuthorizePage/model/AuthorizePageViewModel.ts'
import { useViewModel } from 'src/shared/lib'
import { Page } from 'src/shared/ui'

const OAuthSuccessView = observer(({ model }: { model: AuthorizePageViewModel }) => {
  const handleRedirect = useCallback(() => {
    model.redirectNow()
  }, [model])

  return (
    <Page hideSidebar>
      <Flex alignItems="center" justifyContent="center" flex={1}>
        <VStack gap={6} maxWidth="400px" textAlign="center">
          <Text fontSize="lg" fontWeight="500" color="newGray.500">
            Authorization Successful
          </Text>

          <Text fontSize="sm" color="newGray.400">
            Redirecting back to the application...
          </Text>

          <Button variant="outline" colorPalette="gray" size="sm" onClick={handleRedirect}>
            Continue now
          </Button>
        </VStack>
      </Flex>
    </Page>
  )
})

export const AuthorizePage = observer(() => {
  const model = useViewModel(AuthorizePageViewModel)

  const handleApprove = useCallback(async () => {
    await model.approve()
  }, [model])

  const handleDeny = useCallback(() => {
    model.deny()
  }, [model])

  if (!model.hasOAuthParams) {
    return (
      <Page hideSidebar>
        <Flex alignItems="center" justifyContent="center" flex={1}>
          <Text color="newGray.400">Missing OAuth parameters.</Text>
        </Flex>
      </Page>
    )
  }

  if (model.isAuthorized) {
    return <OAuthSuccessView model={model} />
  }

  return (
    <Page hideSidebar>
      <Flex alignItems="center" justifyContent="center" flex={1}>
        <VStack gap={6} maxWidth="400px" textAlign="center">
          <Text fontSize="lg" fontWeight="500" color="newGray.500">
            Authorize Application
          </Text>

          <Box p={4} bg="newGray.50" borderRadius="md" borderWidth="1px" borderColor="newGray.100" width="100%">
            <Text fontSize="sm" color="newGray.400">
              <Text as="span" fontWeight="600" color="newGray.500">
                {model.oauthClientName}
              </Text>{' '}
              wants to access your Revisium account.
            </Text>
          </Box>

          {model.authorizeError && (
            <Box p={3} bg="red.50" borderRadius="md" borderWidth="1px" borderColor="red.200" width="100%">
              <Text fontSize="xs" color="red.500">
                {model.authorizeError}
              </Text>
            </Box>
          )}

          <Flex gap={3} width="100%">
            <Button
              flex={1}
              variant="outline"
              colorPalette="gray"
              size="sm"
              onClick={handleDeny}
              disabled={model.isAuthorizing}
            >
              Deny
            </Button>
            <Button flex={1} colorPalette="blue" size="sm" onClick={handleApprove} loading={model.isAuthorizing}>
              Authorize
            </Button>
          </Flex>

          <Text fontSize="xs" color="newGray.300">
            This will allow the application to access Revisium on your behalf.
          </Text>
        </VStack>
      </Flex>
    </Page>
  )
})
