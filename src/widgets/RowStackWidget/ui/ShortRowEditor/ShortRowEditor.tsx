import { Box, Flex, Text } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { RowStackModelStateType } from 'src/widgets/RowStackWidget/model/RowStackModel.ts'

interface ShortRowEditorProps {
  previousType: RowStackModelStateType
  tableId: string
  rowId: string
  foreignKeyPath: string
  onCancel: () => void
}

export const ShortRowEditor: React.FC<ShortRowEditorProps> = ({
  previousType,
  tableId,
  rowId,
  foreignKeyPath,
  onCancel,
}) => {
  const prefix = useMemo(() => {
    if (previousType === RowStackModelStateType.UpdatingRow) {
      return 'updating'
    } else if (previousType === RowStackModelStateType.CreatingRow) {
      return 'creating'
    }

    return ''
  }, [previousType])

  return (
    <>
      <Box width="100%" borderStyle="solid" borderLeftWidth={2} borderColor="gray.200" pl="1rem" mb="1rem">
        <Flex gap="4px" alignItems="center" height="30px" mt="2px" mb="2px" color="gray.400" fontWeight="300">
          <Text textDecoration="underline" cursor="pointer" onClick={onCancel}>
            Back
          </Text>
          <Text>
            - {prefix} "{tableId} - {rowId}":
          </Text>
          <Text>{foreignKeyPath}</Text>
        </Flex>
      </Box>
    </>
  )
}
