import { Box, Flex, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { TableCreatingItem, TableUpdatingItem } from 'src/pages/RevisionPage/model/items'
import { TableStackItemType } from 'src/pages/RevisionPage/config/types.ts'

interface ShortSchemaEditorProps {
  item: TableCreatingItem | TableUpdatingItem
}

const getPrefix = (type: TableStackItemType): string => {
  if (type === TableStackItemType.Updating) {
    return 'updating'
  } else if (type === TableStackItemType.Creating) {
    return 'creating'
  }
  return ''
}

export const ShortSchemaEditor: React.FC<ShortSchemaEditorProps> = observer(({ item }) => {
  return (
    <Box width="100%" borderStyle="solid" borderLeftWidth={2} borderColor="gray.200" pl="1rem" mb="1rem">
      <Flex gap="4px" alignItems="center" height="30px" mt="2px" mb="2px" color="gray.400" fontWeight="300">
        <Text textDecoration="underline" cursor="pointer" onClick={item.cancelForeignKeySelection}>
          Back
        </Text>
        <Text whiteSpace="nowrap">
          - {getPrefix(item.type)} "{item.viewModel.tableId}" -
        </Text>
      </Flex>
    </Box>
  )
})
