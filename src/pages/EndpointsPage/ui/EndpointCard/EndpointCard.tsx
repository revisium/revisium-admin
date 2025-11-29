import { Box, Flex, HStack, IconButton, Link, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import { PiCopyLight } from 'react-icons/pi'
import { EndpointItemViewModel } from 'src/pages/EndpointsPage/model/EndpointItemViewModel.ts'
import { toaster } from 'src/shared/ui'
import { DeleteButton } from '../DeleteButton/DeleteButton'

interface EndpointCardProps {
  model: EndpointItemViewModel
}

export const EndpointCard: FC<EndpointCardProps> = observer(({ model }) => {
  const handleCopy = useCallback(() => {
    model.copyUrl()
    toaster.info({
      duration: 1500,
      description: 'Copied to clipboard',
    })
  }, [model])

  return (
    <Box
      className="group"
      p={3}
      borderWidth="1px"
      borderColor="newGray.100"
      borderRadius="md"
      _hover={{ borderColor: 'newGray.200' }}
      width="100%"
    >
      <Flex justify="space-between" align="flex-start">
        <VStack align="flex-start" gap={1} flex={1}>
          <HStack gap={2}>
            <Text fontSize="sm" color="newGray.400">
              {model.typeLabel}
            </Text>
            <Text fontSize="sm" color="newGray.300">
              /
            </Text>
            <Text fontSize="sm" color="newGray.500">
              {model.branchName}
            </Text>
            <Text fontSize="sm" color="newGray.300">
              /
            </Text>
            <Text fontSize="sm" color="newGray.400">
              {model.revisionTag}
            </Text>
          </HStack>
          <HStack gap={1}>
            <Link
              href={model.endpointUrl}
              target="_blank"
              rel="noopener noreferrer"
              fontSize="xs"
              color="newGray.400"
              fontFamily="mono"
              _hover={{ color: 'newGray.500' }}
            >
              {model.endpointUrl}
            </Link>
            <IconButton
              aria-label="Copy URL"
              size="xs"
              variant="plain"
              color="newGray.400"
              opacity={0}
              _groupHover={{ opacity: 1 }}
              onClick={handleCopy}
            >
              <PiCopyLight />
            </IconButton>
            {model.sandboxUrl && (
              <Link
                href={model.sandboxUrl}
                target="_blank"
                rel="noopener noreferrer"
                fontSize="xs"
                color="newGray.400"
                opacity={0}
                _groupHover={{ opacity: 1 }}
                _hover={{ color: 'newGray.500' }}
              >
                Apollo Sandbox
              </Link>
            )}
          </HStack>
        </VStack>
        <DeleteButton onDelete={model.delete} />
      </Flex>
    </Box>
  )
})
