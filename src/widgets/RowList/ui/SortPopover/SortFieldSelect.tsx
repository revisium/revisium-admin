import { Box, Menu, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { SortableField } from 'src/widgets/RowList/config/sortTypes'
import { getFieldTypeIcon } from 'src/widgets/RowList/lib/getFieldTypeIcon'
import { SelectTrigger } from 'src/widgets/RowList/ui/shared'

interface SortFieldSelectProps {
  selectedField: SortableField | undefined
  availableFields: SortableField[]
  onSelect: (field: SortableField) => void
}

export const SortFieldSelect: FC<SortFieldSelectProps> = observer(({ selectedField, availableFields, onSelect }) => {
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
          {availableFields.map((field) => (
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
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  )
})
