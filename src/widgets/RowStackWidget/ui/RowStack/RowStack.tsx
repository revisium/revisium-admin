import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'

import { RowStackModelStateType } from 'src/widgets/RowStackWidget/model/RowStackModel.ts'
import { useRowStackModel } from 'src/widgets/RowStackWidget/model/RowStackModelContext.ts'
import { RowStackCreating } from 'src/widgets/RowStackWidget/ui/RowStackCreating/RowStackCreating.tsx'
import { RowStackList } from 'src/widgets/RowStackWidget/ui/RowStackList/RowStackList.tsx'
import { RowStackUpdating } from 'src/widgets/RowStackWidget/ui/RowStackUpdating/RowStackUpdating.tsx'
import { ShortRowEditor } from 'src/widgets/RowStackWidget/ui/ShortRowEditor/ShortRowEditor.tsx'

export const RowStack: React.FC = observer(() => {
  const { root, item } = useRowStackModel()

  const handleCancelSelectForeignKey = useCallback(() => {
    root.cancelSelectingForeignKey(item)
  }, [item, root])

  if (item.state.type === RowStackModelStateType.ConnectingForeignKeyRow) {
    return (
      <ShortRowEditor
        previousType={item.state.previousType}
        foreignKeyPath={item.currentForeignKeyPath}
        onCancel={handleCancelSelectForeignKey}
        tableId={item.table.id}
        rowId={item.state.store.name.getPlainValue()}
      />
    )
  }

  if (item.state.type === RowStackModelStateType.List) {
    return <RowStackList />
  }

  if (item.state.type === RowStackModelStateType.CreatingRow) {
    return <RowStackCreating />
  }

  if (item.state.type === RowStackModelStateType.UpdatingRow) {
    return <RowStackUpdating />
  }

  return null
})
