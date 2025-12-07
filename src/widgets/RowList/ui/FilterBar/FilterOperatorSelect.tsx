import { Box, Menu, Text } from '@chakra-ui/react'
import { FC } from 'react'
import { LuChevronDown } from 'react-icons/lu'
import { FilterFieldType, FilterOperator, OPERATORS_BY_TYPE } from 'src/widgets/RowList/model/filterTypes'

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
        <Box
          as="button"
          display="flex"
          alignItems="center"
          gap={1}
          px={2}
          py={1}
          borderRadius="md"
          bg="newGray.100"
          _hover={{ bg: 'newGray.200' }}
          cursor="pointer"
          minWidth="80px"
        >
          <Text fontSize="sm" color="newGray.700" truncate>
            {selectedInfo?.label || selectedOperator}
          </Text>
          <Box color="newGray.400">
            <LuChevronDown size={14} />
          </Box>
        </Box>
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
