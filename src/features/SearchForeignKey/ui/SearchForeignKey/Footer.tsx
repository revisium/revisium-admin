import { Button, HStack } from '@chakra-ui/react'
import { FC } from 'react'
import { PiMagnifyingGlassBold, PiPlusBold } from 'react-icons/pi'

interface FooterProps {
  onTable: () => void
  onCreate: () => void
}

export const Footer: FC<FooterProps> = ({ onTable, onCreate }) => {
  return (
    <HStack mt="4px" p="4px" gap={2} borderTopWidth="1px" borderTopStyle="solid" borderTopColor="gray.100">
      <Button size="xs" variant="ghost" color="gray.500" onClick={onTable} flex={1}>
        <PiMagnifyingGlassBold />
        Open Table Search
      </Button>
      <Button size="xs" variant="ghost" color="gray.500" onClick={onCreate} flex={1}>
        <PiPlusBold />
        Create & Connect
      </Button>
    </HStack>
  )
}
