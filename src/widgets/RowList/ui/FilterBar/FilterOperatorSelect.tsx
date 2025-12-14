import { Menu, Text } from '@chakra-ui/react'
import { FC } from 'react'
import { FilterFieldType, FilterOperator, OPERATORS_BY_TYPE } from 'src/widgets/RowList/model/filterTypes'
import { SelectTrigger } from 'src/widgets/RowList/ui/shared'

interface FilterOperatorSelectProps {
  selectedOperator: FilterOperator
  fieldType: FilterFieldType
  onSelect: (operator: FilterOperator) => void
}

export const FilterOperatorSelect: FC<FilterOperatorSelectProps> = ({ selectedOperator, fieldType, onSelect }) => {
  const operators = OPERATORS_BY_TYPE[fieldType]
  const selectedInfo = operators.find((op) => op.operator === selectedOperator)

  return (
    <Menu.Root positioning={{ placement: 'bottom-start' }}>
      <Menu.Trigger asChild>
        <SelectTrigger minWidth="80px">{selectedInfo?.label || selectedOperator}</SelectTrigger>
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content minW="150px">
          {operators.map((opInfo) => (
            <Menu.Item
              key={opInfo.operator}
              value={opInfo.operator}
              onClick={() => onSelect(opInfo.operator)}
              bg={selectedOperator === opInfo.operator ? 'newGray.100' : undefined}
            >
              <Text>{opInfo.label}</Text>
            </Menu.Item>
          ))}
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  )
}
