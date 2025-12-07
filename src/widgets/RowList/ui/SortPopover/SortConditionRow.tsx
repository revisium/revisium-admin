import { Box, IconButton, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { LuX } from 'react-icons/lu'
import { SortConfig, SortDirection, SortableField } from 'src/widgets/RowList/config/sortTypes'
import { SortDirectionSelect } from './SortDirectionSelect'
import { SortFieldSelect } from './SortFieldSelect'

interface SortConditionRowProps {
  sort: SortConfig
  index: number
  availableFields: SortableField[]
  onFieldChange: (nodeId: string, newNodeId: string) => void
  onDirectionChange: (nodeId: string, direction: SortDirection) => void
  onRemove: (nodeId: string) => void
}

export const SortConditionRow: FC<SortConditionRowProps> = observer(
  ({ sort, index, availableFields, onFieldChange, onDirectionChange, onRemove }) => {
    const selectedField = availableFields.find((f) => f.nodeId === sort.id)

    const handleFieldSelect = (field: SortableField) => {
      if (field.nodeId !== sort.id) {
        onFieldChange(sort.id, field.nodeId)
      }
    }

    const handleDirectionSelect = (direction: SortDirection) => {
      onDirectionChange(sort.id, direction)
    }

    const handleRemove = () => onRemove(sort.id)

    return (
      <Box display="flex" alignItems="center" gap={2} py={1}>
        <Text fontSize="xs" color="gray.400" fontWeight="medium" minW="16px">
          {index + 1}.
        </Text>

        <SortFieldSelect selectedField={selectedField} availableFields={availableFields} onSelect={handleFieldSelect} />

        <SortDirectionSelect selectedDirection={sort.direction} onSelect={handleDirectionSelect} />

        <IconButton
          aria-label="Remove sort"
          size="xs"
          variant="ghost"
          color="newGray.400"
          _hover={{ bg: 'newGray.100', color: 'newGray.600' }}
          onClick={handleRemove}
        >
          <LuX />
        </IconButton>
      </Box>
    )
  },
)
