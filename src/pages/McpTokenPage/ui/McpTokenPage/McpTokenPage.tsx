import { Box, Button, Code, Flex, IconButton, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { useCallback } from 'react'
import { PiCopyLight } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import { McpTokenPageViewModel } from 'src/pages/McpTokenPage/model/McpTokenPageViewModel.ts'
import { ROOT_ROUTE } from 'src/shared/config/routes.ts'
import { useViewModel } from 'src/shared/lib'
import { Page, toaster } from 'src/shared/ui'

const OAuthSuccessView = observer(({ model }: { model: McpTokenPageViewModel }) => {
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

const OAuthAuthorizeView = observer(({ model }: { model: McpTokenPageViewModel }) => {
  const handleApprove = useCallback(async () => {
    await model.approve()
  }, [model])

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

const TokenView = observer(({ model }: { model: McpTokenPageViewModel }) => {
  const navigate = useNavigate()

  const handleCopyToken = useCallback(async () => {
    const success = await model.copyAccessToken()
    if (success) {
      toaster.info({ description: 'Access token copied to clipboard' })
    } else {
      toaster.error({ description: 'Failed to copy token' })
    }
  }, [model])

  const handleGoToMain = useCallback(() => {
    navigate(ROOT_ROUTE)
  }, [navigate])

  if (!model.hasAccessToken) {
    return (
      <Page hideSidebar>
        <Flex alignItems="center" justifyContent="center" flex={1}>
          <Text color="newGray.400">No access token available. Please login first.</Text>
        </Flex>
      </Page>
    )
  }

  return (
    <Page hideSidebar>
      <Flex alignItems="center" justifyContent="center" flex={1}>
        <VStack gap={6} maxWidth="500px" textAlign="center">
          <Text fontSize="lg" fontWeight="500" color="newGray.500">
            MCP Access Token
          </Text>

          <Box width="100%">
            <Text fontSize="xs" color="newGray.400" mb={2}>
              Copy this token and use it with the <Code fontSize="xs">loginWithToken</Code> MCP tool:
            </Text>
            <Flex
              align="center"
              gap={2}
              p={3}
              bg="newGray.50"
              borderRadius="md"
              borderWidth="1px"
              borderColor="newGray.100"
            >
              <Code
                fontSize="xs"
                color="newGray.500"
                bg="transparent"
                flex={1}
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
              >
                {model.truncatedToken}
              </Code>
              <IconButton
                aria-label="Copy token"
                size="sm"
                variant="outline"
                colorPalette="gray"
                onClick={handleCopyToken}
              >
                <PiCopyLight />
              </IconButton>
            </Flex>
          </Box>

          <Box p={4} bg="newGray.50" borderRadius="md" borderWidth="1px" borderColor="newGray.100" width="100%">
            <Text fontSize="xs" color="newGray.400">
              You can now close this page and paste the token in your AI assistant.
            </Text>
          </Box>

          <Button variant="outline" colorPalette="gray" size="sm" onClick={handleGoToMain}>
            Go to Main Page
          </Button>
        </VStack>
      </Flex>
    </Page>
  )
})

export const McpTokenPage = observer(() => {
  const model = useViewModel(McpTokenPageViewModel)

  if (model.isOAuthFlow) {
    return <OAuthAuthorizeView model={model} />
  }

  return <TokenView model={model} />
})
