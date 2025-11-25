import { Box, Flex, Text } from '@chakra-ui/react'
import { FC, useMemo } from 'react'
import { computeCharDiff, DiffPart } from '../../lib/diffUtils'
import { formatValue } from '../../lib/fieldChangeUtils'

interface DiffViewProps {
  oldValue: unknown
  newValue: unknown
}

const DiffText: FC<{ parts: DiffPart[]; type: 'old' | 'new' }> = ({ parts, type }) => {
  return (
    <Box
      backgroundColor={type === 'old' ? 'red.50' : 'green.50'}
      padding="0.5rem"
      borderRadius="4px"
      fontFamily="monospace"
      whiteSpace="pre-wrap"
      wordBreak="break-word"
    >
      {parts.map((part, index) => {
        if (part.type === 'unchanged') {
          return <span key={index}>{part.value}</span>
        }

        const bgColor = part.type === 'added' ? 'green.200' : 'red.200'

        return (
          <Box key={index} as="span" backgroundColor={bgColor} borderRadius="2px">
            {part.value}
          </Box>
        )
      })}
    </Box>
  )
}

export const DiffView: FC<DiffViewProps> = ({ oldValue, newValue }) => {
  const oldStr = formatValue(oldValue)
  const newStr = formatValue(newValue)

  const { oldParts, newParts } = useMemo(() => computeCharDiff(oldStr, newStr), [oldStr, newStr])

  return (
    <Box fontSize="12px">
      <Flex gap="1rem">
        <Box flex={1}>
          <Text color="red.600" fontWeight="500" mb="0.25rem">
            Old:
          </Text>
          <DiffText parts={oldParts} type="old" />
        </Box>
        <Box flex={1}>
          <Text color="green.600" fontWeight="500" mb="0.25rem">
            New:
          </Text>
          <DiffText parts={newParts} type="new" />
        </Box>
      </Flex>
    </Box>
  )
}
