import { Box, Button, Popover, Portal, Text } from '@chakra-ui/react'
import { FC, useCallback, useState } from 'react'
import { LuFilter } from 'react-icons/lu'
import { FilterModel } from 'src/widgets/RowList/model/FilterModel'
import {
  FilterableField,
  FilterOperator,
  getDefaultOperator,
  operatorRequiresValue,
} from 'src/widgets/RowList/model/filterTypes'
import { FilterOperatorSelect } from '../FilterBar/FilterOperatorSelect'
import { FilterValueInput } from '../FilterBar/FilterValueInput'

interface AddFilterPopoverProps {
  field: FilterableField
  filterModel: FilterModel
  isOpen: boolean
  onClose: () => void
  anchorRef: React.RefObject<HTMLElement | null>
}

export const AddFilterPopover: FC<AddFilterPopoverProps> = ({
  field,
  filterModel,
  isOpen,
  onClose,
  anchorRef,
}) => {
  const [operator, setOperator] = useState<FilterOperator>(() => getDefaultOperator(field.fieldType))
  const [value, setValue] = useState<string | number | boolean>('')
  const [error, setError] = useState(false)

  const showValueInput = operatorRequiresValue(operator, field.fieldType)

  const handleOperatorSelect = useCallback((op: FilterOperator) => {
    setOperator(op)
    setError(false)
  }, [])

  const handleValueChange = useCallback((val: string | number | boolean) => {
    setValue(val)
    setError(false)
  }, [])

  const handleCancel = useCallback(() => {
    setOperator(getDefaultOperator(field.fieldType))
    setValue('')
    setError(false)
    onClose()
  }, [field.fieldType, onClose])

  const handleAdd = useCallback(() => {
    if (showValueInput && (value === '' || value === null)) {
      setError(true)
      return
    }

    filterModel.addCondition(filterModel.rootGroup.id, field)

    const conditions = filterModel.rootGroup.conditions
    const lastCondition = conditions[conditions.length - 1]

    if (lastCondition) {
      filterModel.updateCondition(lastCondition.id, {
        operator,
        value: showValueInput ? value : null,
      })
    }

    filterModel.apply()

    setOperator(getDefaultOperator(field.fieldType))
    setValue('')
    setError(false)
    onClose()
  }, [filterModel, field, operator, value, showValueInput, onClose])

  const getAnchorRect = useCallback(() => {
    return anchorRef.current?.getBoundingClientRect() ?? null
  }, [anchorRef])

  return (
    <Popover.Root
      open={isOpen}
      onOpenChange={({ open }) => {
        if (!open) handleCancel()
      }}
      lazyMount
      unmountOnExit
      autoFocus
      positioning={{
        placement: 'bottom-start',
        getAnchorRect,
      }}
    >
      <Portal>
        <Popover.Positioner>
          <Popover.Content p={3} minW="280px" boxShadow="lg">
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Box color="gray.400">
                <LuFilter size={14} />
              </Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.600">
                Filter by {field.name}
              </Text>
            </Box>

            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <FilterOperatorSelect
                selectedOperator={operator}
                fieldType={field.fieldType}
                onSelect={handleOperatorSelect}
              />

              {showValueInput && (
                <FilterValueInput
                  value={value}
                  fieldType={field.fieldType}
                  error={error}
                  onChange={handleValueChange}
                />
              )}
            </Box>

            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button size="xs" variant="ghost" colorPalette="gray" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="xs" variant="subtle" colorPalette="gray" onClick={handleAdd}>
                Add
              </Button>
            </Box>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
}
