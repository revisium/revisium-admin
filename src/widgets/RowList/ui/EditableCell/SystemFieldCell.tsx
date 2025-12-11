import { Box, Text } from '@chakra-ui/react'
import { FC } from 'react'
import { formatDate } from 'src/shared/lib/helpers'
import { Tooltip } from 'src/shared/ui/Tooltip/tooltip'
import { FilterFieldType } from '../../model/filterTypes'

interface SystemFieldCellProps {
  value: string | null
  fieldType: FilterFieldType | null
}

export const SystemFieldCell: FC<SystemFieldCellProps> = ({ value, fieldType }) => {
  const displayValue = formatValue(value, fieldType)
  const isDateTime = fieldType === FilterFieldType.DateTime
  const showTooltip = isDateTime && value !== null && value !== ''

  const content = (
    <Box
      as="td"
      minHeight="40px"
      height="40px"
      borderRightWidth="1px"
      borderColor="gray.100"
      overflow="hidden"
      maxWidth="0"
      pl="8px"
      pr="8px"
      position="relative"
      cursor="default"
      color="gray.500"
    >
      <Box display="flex" alignItems="center" height="100%" width="100%" minWidth={0}>
        <Text whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" fontWeight="300" flex={1} minWidth={0}>
          {displayValue}
        </Text>
      </Box>
    </Box>
  )

  if (showTooltip) {
    return (
      <Tooltip content={value} positioning={{ placement: 'top' }}>
        {content}
      </Tooltip>
    )
  }

  return content
}

function formatValue(value: string | null, fieldType: FilterFieldType | null): string {
  if (value === null || value === '') {
    return '—'
  }

  if (fieldType === FilterFieldType.DateTime) {
    return formatDate(value)
  }

  return value
}
