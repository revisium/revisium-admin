import { Box, IconButton, Menu, Portal, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { PiListBullets, PiPlus } from 'react-icons/pi'
import { AvailableField } from 'src/widgets/RowList/model/types'
import { FieldMenuItem } from 'src/widgets/RowList/ui/shared'

interface AddColumnButtonProps {
  availableFields: AvailableField[]
  availableSystemFields: AvailableField[]
  hasHiddenColumns: boolean
  onAddColumn: (nodeId: string) => void
  onAddAll: () => void
}

export const AddColumnButton: FC<AddColumnButtonProps> = observer(
  ({ availableFields, availableSystemFields, hasHiddenColumns, onAddColumn, onAddAll }) => {
    if (!hasHiddenColumns) {
      return (
        <Box as="th" backgroundColor="white" position="sticky" right={0} zIndex={1} width="40px">
          <Box height="30px" borderBottomWidth="1px" borderColor="gray.100" />
        </Box>
      )
    }

    return (
      <Box as="th" backgroundColor="white" position="sticky" right={0} zIndex={1} width="40px">
        <Box height="30px" borderBottomWidth="1px" borderColor="gray.100" display="flex" alignItems="center">
          <Menu.Root positioning={{ placement: 'bottom-start' }} lazyMount unmountOnExit>
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
                <Menu.Content minW="200px" maxH="340px" overflowY="auto">
                  <Menu.Item value="add-all" onClick={onAddAll}>
                    <PiListBullets />
                    <Text>Add all columns</Text>
                  </Menu.Item>
                  {availableFields.length > 0 && (
                    <>
                      <Menu.Separator />
                      <Menu.ItemGroup>
                        <Menu.ItemGroupLabel fontWeight="medium" color="gray.500" fontSize="xs">
                          Data fields
                        </Menu.ItemGroupLabel>
                        {availableFields.map((field) => (
                          <FieldMenuItem
                            key={field.nodeId}
                            nodeId={field.nodeId}
                            name={field.name}
                            fieldType={field.fieldType}
                            onClick={onAddColumn}
                          />
                        ))}
                      </Menu.ItemGroup>
                    </>
                  )}
                  {availableSystemFields.length > 0 && (
                    <>
                      <Menu.Separator />
                      <Menu.ItemGroup>
                        <Menu.ItemGroupLabel fontWeight="medium" color="gray.500" fontSize="xs">
                          System fields
                        </Menu.ItemGroupLabel>
                        {availableSystemFields.map((field) => (
                          <FieldMenuItem
                            key={field.nodeId}
                            nodeId={field.nodeId}
                            name={field.name}
                            fieldType={field.fieldType}
                            onClick={onAddColumn}
                          />
                        ))}
                      </Menu.ItemGroup>
                    </>
                  )}
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Box>
      </Box>
    )
  },
)
