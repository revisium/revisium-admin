import { Flex, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { createJsonValuePathByStore } from 'src/entities/Schema/lib/createJsonValuePathByStore.ts'
import { RowDataCardStore } from 'src/entities/Schema/model/row-data-card.store.ts'

interface RowDataCardFooterProps {
  store: RowDataCardStore
}

export const RowDataCardFooter: React.FC<RowDataCardFooterProps> = observer(({ store }) => {
  return (
    <Flex
      height="40px"
      paddingBottom="4px"
      alignItems="flex-end"
      backgroundColor="white"
      width="100%"
      position="sticky"
      bottom={0}
      justifyContent="space-between"
    >
      <Text color="gray" opacity="0.4">
        {store.isComplexStructure && store.overNode && createJsonValuePathByStore(store.overNode)}
      </Text>
    </Flex>
  )
})
