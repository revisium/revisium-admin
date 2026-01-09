import { Box, Flex, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useMemo } from 'react'
import { RowStackItemType } from 'src/pages/RowPage/config/types.ts'
import { RowCreatingItem, RowUpdatingItem } from 'src/pages/RowPage/model/items'

interface Props {
  item: RowCreatingItem | RowUpdatingItem
}

export const ShortRowEditor: React.FC<Props> = observer(({ item }) => {
  const prefix = useMemo(() => {
    if (item.type === RowStackItemType.Updating) {
      return 'updating'
    } else if (item.type === RowStackItemType.Creating) {
      return 'creating'
    }

    return ''
  }, [item.type])

  const rowId = item.type === RowStackItemType.Creating ? item.rowId : (item as RowUpdatingItem).currentRowId

  return (
    <Box width="100%" borderStyle="solid" borderLeftWidth={2} borderColor="gray.200" pl="1rem" mb="1rem">
      <Flex gap="4px" alignItems="center" height="30px" mt="2px" mb="2px" color="gray.400" fontWeight="300">
        <Text textDecoration="underline" cursor="pointer" onClick={item.cancelForeignKeySelection}>
          Back
        </Text>
        <Text>
          - {prefix} "{item.tableId} - {rowId}":
        </Text>
        <Text>{item.pendingForeignKeyPath}</Text>
      </Flex>
    </Box>
  )
})
