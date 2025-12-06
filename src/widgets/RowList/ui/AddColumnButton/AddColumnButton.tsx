import { Box, IconButton, Menu, Portal, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { PiPlus, PiListBullets } from 'react-icons/pi'

interface AvailableField {
  nodeId: string
  name: string
}

interface AddColumnButtonProps {
  availableFields: AvailableField[]
  hasHiddenColumns: boolean
  onAddColumn: (nodeId: string) => void
  onAddAll: () => void
}

export const AddColumnButton: FC<AddColumnButtonProps> = observer(
  ({ availableFields, hasHiddenColumns, onAddColumn, onAddAll }) => {
    if (!hasHiddenColumns) {
      return (
        <Box as="th" backgroundColor="white" width="100%">
          <Box height="30px" borderBottomWidth="1px" borderColor="gray.100" />
        </Box>
      )
    }

    return (
      <Box as="th" backgroundColor="white" width="100%">
        <Box height="30px" borderBottomWidth="1px" borderColor="gray.100" pl="8px" display="flex" alignItems="center">
          <Menu.Root positioning={{ placement: 'bottom-start' }}>
            <Menu.Trigger asChild>
              <IconButton
                focusRing="none"
                aria-label="Add column"
                size="xs"
                variant="ghost"
                color="gray.400"
                _hover={{ bg: 'gray.100', color: 'gray.600' }}
              >
                <PiPlus />
              </IconButton>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content minW="180px">
                  <Menu.Item value="add-all" onClick={onAddAll}>
                    <PiListBullets />
                    <Text>Add all columns</Text>
                  </Menu.Item>
                  {availableFields.length > 0 && <Menu.Separator />}
                  {availableFields.map((field) => (
                    <Menu.Item key={field.nodeId} value={field.nodeId} onClick={() => onAddColumn(field.nodeId)}>
                      <Text>{field.name || '(unnamed)'}</Text>
                    </Menu.Item>
                  ))}
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Box>
      </Box>
    )
  },
)
