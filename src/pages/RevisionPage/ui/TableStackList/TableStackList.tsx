import { Box, Skeleton, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { CreateTableButton } from 'src/features/CreateTableButton'
import { TableList } from 'src/widgets/TableList'
import { TableListItem } from 'src/pages/RevisionPage/model/items'
import { SelectingForeignKeyDivider } from 'src/pages/RevisionPage/ui/SelectingForeignKeyDivider/SelectingForeignKeyDivider.tsx'

interface Props {
  item: TableListItem
}

const TableListSkeleton: React.FC = () => (
  <VStack gap={2} align="stretch" paddingTop="0.5rem" paddingBottom="1rem">
    {Array.from({ length: 7 }).map((_, i) => (
      <Skeleton key={i} height="40px" />
    ))}
  </VStack>
)

export const TableStackList: React.FC<Props> = observer(({ item }) => {
  if (item.isRevisionLoading) {
    return <TableListSkeleton />
  }

  return (
    <>
      {item.isSelectingForeignKey && <SelectingForeignKeyDivider />}
      {item.canCreateTable && <CreateTableButton onClick={item.toCreating} />}

      <Box paddingTop="0.5rem" paddingBottom="1rem">
        <TableList
          onSettings={item.toUpdating}
          onCopy={item.toCloning}
          onSelect={item.isSelectingForeignKey ? item.selectTable : undefined}
        />
      </Box>
    </>
  )
})
