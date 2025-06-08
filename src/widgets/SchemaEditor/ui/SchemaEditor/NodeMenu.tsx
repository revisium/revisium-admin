import { Box, Menu, Portal } from '@chakra-ui/react'
import { FC } from 'react'
import { PiGear, PiTrash } from 'react-icons/pi'
import { SettingsButton } from 'src/shared/ui'

interface NodeMenuProps {
  open: boolean
  setOpen: (open: boolean) => void
  dataTestId: string
  className?: string
  onRemove?: () => void
  onSettings?: () => void
}

export const NodeMenu: FC<NodeMenuProps> = ({ open, setOpen, dataTestId, className, onRemove, onSettings }) => {
  if (!onRemove) {
    return null
  }

  return (
    <Menu.Root
      open={open}
      onOpenChange={(value) => setOpen(value.open)}
      positioning={{
        placement: 'bottom-start',
      }}
    >
      <Menu.Trigger>
        <SettingsButton
          height="26px"
          color="gray.300"
          _hover={{ color: 'gray.400' }}
          className={className}
          dataTestId={dataTestId}
        />
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item
              color="gray.600"
              value="settings"
              data-restid={`${dataTestId}-settings-button`}
              onClick={onSettings}
            >
              <PiGear />
              <Box flex={1}>Settings</Box>
            </Menu.Item>
            <Menu.Item color="gray.600" value="delete" data-restid={`${dataTestId}-remove-button`} onClick={onRemove}>
              <PiTrash />
              <Box flex={1}>Delete</Box>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
