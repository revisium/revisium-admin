import { observer } from 'mobx-react-lite'
import React from 'react'
import { TableStackItem } from 'src/pages/RevisionPage/model/items'
import { TableStackItemType } from 'src/pages/RevisionPage/config/types.ts'
import { ShortSchemaEditor } from 'src/pages/RevisionPage/ui/ShoreSchemaEditor/ShortSchemaEditor.tsx'
import { TableStackList } from 'src/pages/RevisionPage/ui/TableStackList/TableStackList.tsx'
import { TableStackEditor } from 'src/pages/RevisionPage/ui/TableStackEditor'

interface Props {
  item: TableStackItem
}

export const TableStack: React.FC<Props> = observer(({ item }) => {
  if (item.hasPendingRequest) {
    if (item.type === TableStackItemType.Creating || item.type === TableStackItemType.Updating) {
      return <ShortSchemaEditor item={item} />
    }
  }

  if (item.type === TableStackItemType.List) {
    return <TableStackList item={item} />
  }

  if (item.type === TableStackItemType.Creating || item.type === TableStackItemType.Updating) {
    return <TableStackEditor item={item} />
  }

  return null
})
