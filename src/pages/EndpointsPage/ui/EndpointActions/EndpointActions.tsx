import { HStack, IconButton } from '@chakra-ui/react'
import { FC } from 'react'
import { PiCodeLight, PiCopyLight, PiFlaskLight } from 'react-icons/pi'
import { toaster, Tooltip } from 'src/shared/ui'

interface EndpointActionsProps {
  copyTooltip: string
  sandboxUrl?: string
  swaggerUrl?: string
  onCopy: () => void
}

export const EndpointActions: FC<EndpointActionsProps> = ({ copyTooltip, sandboxUrl, swaggerUrl, onCopy }) => {
  const handleCopy = () => {
    onCopy()
    toaster.info({
      duration: 1500,
      description: 'Copied to clipboard',
    })
  }

  return (
    <HStack gap={1}>
      <Tooltip content={copyTooltip}>
        <IconButton
          aria-label="Copy URL"
          size="xs"
          variant="ghost"
          color="newGray.400"
          _hover={{ color: 'newGray.600', backgroundColor: 'newGray.100' }}
          onClick={handleCopy}
        >
          <PiCopyLight size={16} />
        </IconButton>
      </Tooltip>

      {sandboxUrl && (
        <Tooltip content="Open Apollo Sandbox">
          <IconButton
            asChild
            aria-label="Open Sandbox"
            size="xs"
            variant="ghost"
            color="newGray.400"
            _hover={{ color: 'newGray.600', backgroundColor: 'newGray.100' }}
          >
            <a href={sandboxUrl} target="_blank" rel="noopener noreferrer">
              <PiFlaskLight size={16} />
            </a>
          </IconButton>
        </Tooltip>
      )}

      {swaggerUrl && (
        <Tooltip content="Open Swagger UI">
          <IconButton
            asChild
            aria-label="Open Swagger"
            size="xs"
            variant="ghost"
            color="newGray.400"
            _hover={{ color: 'newGray.600', backgroundColor: 'newGray.100' }}
          >
            <a href={swaggerUrl} target="_blank" rel="noopener noreferrer">
              <PiCodeLight size={16} />
            </a>
          </IconButton>
        </Tooltip>
      )}
    </HStack>
  )
}
