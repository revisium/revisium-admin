import { Box } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { CreateTableButton } from 'src/features/CreateTableButton'
import { TableList } from 'src/widgets/TableList'
import { TableListItem } from 'src/pages/RevisionPage/model/items'
import { SelectingForeignKeyDivider } from 'src/pages/RevisionPage/ui/SelectingForeignKeyDivider/SelectingForeignKeyDivider.tsx'

interface Props {
  item: TableListItem
}

export const TableStackList: React.FC<Props> = observer(({ item }) => {
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
