import { Box, Menu, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { getFieldTypeIcon } from 'src/widgets/RowList/lib/getFieldTypeIcon'
import { FilterableField } from 'src/widgets/RowList/model/filterTypes'
import { SelectTrigger } from 'src/widgets/RowList/ui/shared'

interface FilterFieldSelectProps {
  selectedField: FilterableField | undefined
  dataFields: FilterableField[]
  systemFields: FilterableField[]
  onSelect: (field: FilterableField) => void
}

export const FilterFieldSelect: FC<FilterFieldSelectProps> = observer(
  ({ selectedField, dataFields, systemFields, onSelect }) => {
    const hasDataFields = dataFields.length > 0
    const hasSystemFields = systemFields.length > 0

    return (
      <Menu.Root positioning={{ placement: 'bottom-start' }}>
        <Menu.Trigger asChild>
          <SelectTrigger
            icon={selectedField ? getFieldTypeIcon(selectedField.fieldType) : undefined}
            placeholder="Select field"
          >
            {selectedField?.name}
          </SelectTrigger>
        </Menu.Trigger>
        <Menu.Positioner>
          <Menu.Content minW="180px" maxH="300px" overflow="auto">
            {hasDataFields && (
              <Menu.ItemGroup>
                <Menu.ItemGroupLabel fontWeight="medium" color="gray.500" fontSize="xs">
                  Data fields
                </Menu.ItemGroupLabel>
                {dataFields.map((field) => (
                  <Menu.Item
                    key={field.nodeId}
                    value={field.nodeId}
                    onClick={() => onSelect(field)}
                    bg={selectedField?.nodeId === field.nodeId ? 'newGray.100' : undefined}
                  >
                    <Box display="flex" alignItems="center" gap={2} width="100%">
                      <Box fontSize="xs" fontFamily="mono" color="newGray.400" width="24px" textAlign="center">
                        {getFieldTypeIcon(field.fieldType)}
                      </Box>
                      <Text truncate>{field.name || '(unnamed)'}</Text>
                    </Box>
                  </Menu.Item>
                ))}
              </Menu.ItemGroup>
            )}
            {hasSystemFields && (
              <Menu.ItemGroup>
                <Menu.ItemGroupLabel fontWeight="medium" color="gray.500" fontSize="xs">
                  System fields
                </Menu.ItemGroupLabel>
                {systemFields.map((field) => (
                  <Menu.Item
                    key={field.nodeId}
                    value={field.nodeId}
                    onClick={() => onSelect(field)}
                    bg={selectedField?.nodeId === field.nodeId ? 'newGray.100' : undefined}
                  >
                    <Box display="flex" alignItems="center" gap={2} width="100%">
                      <Box fontSize="xs" fontFamily="mono" color="newGray.400" width="24px" textAlign="center">
                        {getFieldTypeIcon(field.fieldType)}
                      </Box>
                      <Text truncate>{field.name || '(unnamed)'}</Text>
                    </Box>
                  </Menu.Item>
                ))}
              </Menu.ItemGroup>
            )}
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    )
  },
)
