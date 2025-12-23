import { Box, Text } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { ColumnType } from '../model/types'

export function buildColumnTooltip(column: ColumnType): ReactNode {
  const lines: string[] = []

  lines.push(column.path)

  if (column.isDeprecated) {
    if (column.deprecatedReason) {
      lines.push(`Deprecated: ${column.deprecatedReason}`)
    } else {
      lines.push('Deprecated')
    }
  }

  if (lines.length === 1) {
    return lines[0]
  }

  return (
    <Box>
      {lines.map((line, index) => (
        <Text key={index} fontSize="xs">
          {line}
        </Text>
      ))}
    </Box>
  )
}
