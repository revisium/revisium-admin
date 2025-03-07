import { Box, Flex, Text } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { TableStackModelStateType } from 'src/pages/RevisionPage/model/TableStackModel.ts'

interface ShortSchemaEditorProps {
  previousType: TableStackModelStateType
  tableId: string
  foreignKeyPath: string
  onCancel: () => void
}

export const ShortSchemaEditor: React.FC<ShortSchemaEditorProps> = ({
  previousType,
  tableId,
  foreignKeyPath,
  onCancel,
}) => {
  const prefix = useMemo(() => {
    if (previousType === TableStackModelStateType.UpdatingTable) {
      return 'updating'
    } else if (previousType === TableStackModelStateType.CreatingTable) {
      return 'creating'
    }

    return ''
  }, [previousType])

  return (
    <Box width="100%" borderStyle="solid" borderLeftWidth={2} borderColor="gray.200" pl="1rem" mb="1rem">
      <Flex gap="4px" alignItems="center" height="30px" mt="2px" mb="2px" color="gray.400" fontWeight="300">
        <Text textDecoration="underline" cursor="pointer" onClick={onCancel}>
          Back
        </Text>
        <Text whiteSpace="nowrap">
          - {prefix} "{tableId}" -
        </Text>
        <Text minWidth={0} dir="rtl" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
          path: {foreignKeyPath}
        </Text>
      </Flex>
    </Box>
  )
}
