import { Menu, Portal, Text } from '@chakra-ui/react'
import { FC } from 'react'
import { LuChevronRight } from 'react-icons/lu'
import { AvailableField } from 'src/widgets/RowList/model/types'
import { FieldList, FieldMenuItem } from 'src/widgets/RowList/ui/shared'

interface InsertColumnSubmenuProps {
  label: string
  valuePrefix: string
  availableFields: AvailableField[]
  availableSystemFields: AvailableField[]
  onSelect: (nodeId: string) => void
  getAvailableFileChildren: (field: AvailableField) => AvailableField[]
  isColumnVisible: (nodeId: string) => boolean
}

export const InsertColumnSubmenu: FC<InsertColumnSubmenuProps> = ({
  label,
  valuePrefix,
  availableFields,
  availableSystemFields,
  onSelect,
  getAvailableFileChildren,
  isColumnVisible,
}) => {
  return (
    <Menu.Root positioning={{ placement: 'right-start', gutter: 2 }} lazyMount unmountOnExit>
      <Menu.TriggerItem>
        <Text flex={1}>{label}</Text>
        <LuChevronRight />
      </Menu.TriggerItem>
      <Portal>
        <Menu.Positioner>
          <Menu.Content maxH="300px" minW="200px" overflowY="auto">
            {availableFields.length > 0 && (
              <Menu.ItemGroup>
                <Menu.ItemGroupLabel fontWeight="medium" color="gray.500" fontSize="xs">
                  Data fields
                </Menu.ItemGroupLabel>
                <FieldList
                  fields={availableFields}
                  valuePrefix={valuePrefix}
                  onSelect={onSelect}
                  getAvailableFileChildren={getAvailableFileChildren}
                  isColumnVisible={isColumnVisible}
                />
              </Menu.ItemGroup>
            )}
            {availableSystemFields.length > 0 && (
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
}
