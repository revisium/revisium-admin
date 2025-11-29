import { Box, Flex, HStack, IconButton, Link, Text } from '@chakra-ui/react'
import { FC, useCallback } from 'react'
import { PiCopyLight } from 'react-icons/pi'
import { toaster } from 'src/shared/ui'

interface SystemApiRowProps {
  label: string
  url: string
  onCopy: () => void
}

export const SystemApiRow: FC<SystemApiRowProps> = ({ label, url, onCopy }) => {
  const handleCopy = useCallback(() => {
    onCopy()
    toaster.info({
      duration: 1500,
      description: 'Copied to clipboard',
    })
  }, [onCopy])

  return (
    <Box className="group">
      <Flex justify="space-between" align="center" width="100%">
        <HStack gap={2} flex={1}>
          <Text fontSize="sm" color="newGray.400" minWidth="80px">
            {label}
          </Text>
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            fontSize="xs"
            color="newGray.400"
            fontFamily="mono"
          >
            {url}
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
        </HStack>
      </Flex>
    </Box>
  )
}
