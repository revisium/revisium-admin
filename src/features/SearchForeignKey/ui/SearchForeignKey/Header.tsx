import { Flex, IconButton, Popover, Text } from '@chakra-ui/react'
import { FC } from 'react'
import { PiXBold } from 'react-icons/pi'

interface HeaderProps {
  tableId: string
  onClose?: () => void
}

export const Header: FC<HeaderProps> = ({ tableId, onClose }) => {
  return (
    <Flex p="4px" align="center" justify="space-between">
      <Text color="gray.600" fontWeight="medium">
        Select from "{tableId}"
      </Text>
      <Popover.CloseTrigger asChild>
        <IconButton size="xs" variant="ghost" color="gray.400" aria-label="Close" onClick={onClose}>
          <PiXBold />
        </IconButton>
      </Popover.CloseTrigger>
    </Flex>
  )
}
