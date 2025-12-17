import { Box, IconButton, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { LuX } from 'react-icons/lu'
import { FilterModel } from 'src/widgets/RowList/model/FilterModel'
import {
  FilterableField,
  FilterCondition,
  FilterOperator,
  operatorRequiresValue,
} from 'src/widgets/RowList/model/filterTypes'
import { FilterFieldSelect } from './FilterFieldSelect'
import { FilterOperatorSelect } from './FilterOperatorSelect'
import { FilterValueInput } from './FilterValueInput'

interface FilterConditionRowProps {
  filterModel: FilterModel
  condition: FilterCondition
  testId?: string
}

export const FilterConditionRow: FC<FilterConditionRowProps> = observer(({ filterModel, condition, testId }) => {
  const selectedField = filterModel.allFields.find((f) => f.name === condition.field)
  const showValueInput = operatorRequiresValue(condition.operator, condition.fieldType)
  const error = filterModel.getErrorForCondition(condition.id)

  const handleFieldSelect = (field: FilterableField) => {
    filterModel.updateCondition(condition.id, {
      field: field.name,
      fieldPath: field.path,
      fieldType: field.fieldType,
      isSystemField: field.isSystemField,
      systemFieldId: field.systemFieldId,
    })
  }

  const handleOperatorSelect = (operator: FilterOperator) => {
    filterModel.updateCondition(condition.id, { operator })
  }

  const handleValueChange = (value: string | number | boolean) => {
    filterModel.updateCondition(condition.id, { value })
  }

  const handleRemove = () => filterModel.removeCondition(condition.id)

  return (
    <Box data-testid={testId}>
      <Box display="flex" alignItems="center" gap={2} py={1}>
        <FilterFieldSelect
          selectedField={selectedField}
          dataFields={filterModel.availableFields}
          systemFields={filterModel.systemFields}
          onSelect={handleFieldSelect}
        />

        <FilterOperatorSelect
          selectedOperator={condition.operator}
          fieldType={condition.fieldType}
          onSelect={handleOperatorSelect}
        />

        {showValueInput && (
          <FilterValueInput
            value={condition.value}
            fieldType={condition.fieldType}
            error={!!error}
            onChange={handleValueChange}
          />
        )}

        <IconButton
          aria-label="Remove filter"
          size="xs"
          variant="ghost"
          color="newGray.400"
          _hover={{ bg: 'newGray.100', color: 'newGray.600' }}
          onClick={handleRemove}
        >
          <LuX />
        </IconButton>
      </Box>
      {error && (
        <Text fontSize="xs" color="red.500" ml={2}>
          {error}
        </Text>
      )}
    </Box>
  )
})
