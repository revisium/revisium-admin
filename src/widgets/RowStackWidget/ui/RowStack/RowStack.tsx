import { observer } from 'mobx-react-lite'
import React from 'react'
import { RowStackItem } from 'src/pages/RowPage/model'
import { RowStackItemType } from 'src/pages/RowPage/config/types.ts'
import { RowStackCreating } from 'src/widgets/RowStackWidget/ui/RowStackCreating/RowStackCreating.tsx'
import { RowStackList } from 'src/widgets/RowStackWidget/ui/RowStackList/RowStackList.tsx'
import { RowStackUpdating } from 'src/widgets/RowStackWidget/ui/RowStackUpdating/RowStackUpdating.tsx'
import { ShortRowEditor } from 'src/widgets/RowStackWidget/ui/ShortRowEditor/ShortRowEditor.tsx'

interface Props {
  item: RowStackItem
}

export const RowStack: React.FC<Props> = observer(({ item }) => {
  if (item.hasPendingRequest) {
    if (item.type === RowStackItemType.Creating || item.type === RowStackItemType.Updating) {
      return <ShortRowEditor item={item} />
    }
  }

  if (item.type === RowStackItemType.List) {
    return <RowStackList item={item} />
  }

  if (item.type === RowStackItemType.Creating) {
    return <RowStackCreating item={item} />
  }

  if (item.type === RowStackItemType.Updating) {
    return <RowStackUpdating item={item} />
  }

  return null
})
