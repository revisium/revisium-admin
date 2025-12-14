import { Box, Menu, Portal, Text } from '@chakra-ui/react'
import { FC, memo } from 'react'
import { LuChevronRight } from 'react-icons/lu'
import { getFieldTypeIcon } from 'src/widgets/RowList/lib/getFieldTypeIcon'
import { AvailableField } from 'src/widgets/RowList/model/types'
import { FieldMenuItem } from './FieldMenuItem'

interface FileFieldSubmenuProps {
  field: AvailableField
  availableChildren: AvailableField[]
  isSelfVisible: boolean
  valuePrefix?: string
  onSelect: (nodeId: string) => void
}

export const FileFieldSubmenu: FC<FileFieldSubmenuProps> = memo(
  ({ field, availableChildren, isSelfVisible, valuePrefix, onSelect }) => {
    return (
      <Menu.Root positioning={{ placement: 'right-start', gutter: 2 }} lazyMount unmountOnExit>
        <Menu.TriggerItem>
          <Box display="flex" alignItems="center" gap={2} width="100%">
            {field.fieldType && (
              <Box as="span" fontSize="xs" fontWeight="medium" color="gray.400" fontFamily="mono" minWidth="20px">
                {getFieldTypeIcon(field.fieldType)}
              </Box>
            )}
            <Text truncate flex={1}>
              {field.name}
            </Text>
            <LuChevronRight />
          </Box>
        </Menu.TriggerItem>
        <Portal>
          <Menu.Positioner>
            <Menu.Content minW="180px" maxH="300px" overflowY="auto">
              {!isSelfVisible && (
                <Menu.ItemGroup>
                  <Menu.ItemGroupLabel fontWeight="medium" color="gray.500" fontSize="xs">
                    File column
                  </Menu.ItemGroupLabel>
                  <FieldMenuItem
                    nodeId={field.nodeId}
                    name={field.name}
                    fieldType={field.fieldType}
                    valuePrefix={valuePrefix}
                    onClick={onSelect}
                  />
                </Menu.ItemGroup>
              )}
              {availableChildren.length > 0 && (
                <Menu.ItemGroup>
                  <Menu.ItemGroupLabel fontWeight="medium" color="gray.500" fontSize="xs">
                    Properties
                  </Menu.ItemGroupLabel>
                  {availableChildren.map((child) => (
                    <FieldMenuItem
                      key={child.nodeId}
                      nodeId={child.nodeId}
                      name={child.name}
                      fieldType={child.fieldType}
                      valuePrefix={valuePrefix}
                      onClick={onSelect}
                    />
                  ))}
                </Menu.ItemGroup>
              )}
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    )
  },
)
