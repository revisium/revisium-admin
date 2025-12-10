import { Box, Button, HStack, Link as ChakraLink } from '@chakra-ui/react'
import { FC } from 'react'
import { PiMagnifyingGlassBold, PiPlusBold } from 'react-icons/pi'
import { Link } from 'react-router-dom'
import { Tooltip } from 'src/shared/ui'

interface FooterProps {
  onTable: () => void
  onCreate: () => void
  disabled?: boolean
  rowLinkPath?: string
}

export const Footer: FC<FooterProps> = ({ onTable, onCreate, disabled, rowLinkPath }) => {
  if (disabled) {
    return (
      <Box mt="4px" p="8px" borderTopWidth="1px" borderTopStyle="solid" borderTopColor="gray.200">
        <Box fontSize="xs" color="gray.400" textAlign="center">
          Table search and create are not yet available in inline mode.{' '}
          {rowLinkPath && (
            <ChakraLink asChild color="blue.500" textDecoration="underline">
              <Link to={rowLinkPath}>Open row page</Link>
            </ChakraLink>
          )}
        </Box>
      </Box>
    )
  }

  return (
    <HStack mt="4px" p="4px" gap={2} borderTopWidth="1px" borderTopStyle="solid" borderTopColor="gray.200">
      <Tooltip content="Open in row page for table search" positioning={{ placement: 'top' }}>
        <Button size="xs" variant="ghost" color="gray.500" onClick={onTable} flex={1}>
          <PiMagnifyingGlassBold />
          Open Table Search
        </Button>
      </Tooltip>
      <Tooltip content="Open in row page to create new" positioning={{ placement: 'top' }}>
        <Button size="xs" variant="ghost" color="gray.500" onClick={onCreate} flex={1}>
          <PiPlusBold />
          Create & Connect
        </Button>
      </Tooltip>
    </HStack>
  )
}
