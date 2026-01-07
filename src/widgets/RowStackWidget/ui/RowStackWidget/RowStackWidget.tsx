import { observer } from 'mobx-react-lite'
import React from 'react'
import { useParams } from 'react-router-dom'
import { RowStackManager } from 'src/pages/RowPage/model/RowStackManager.ts'
import { useViewModel } from 'src/shared/lib/hooks/useViewModel.ts'
import { RowStack } from 'src/widgets/RowStackWidget/ui/RowStack/RowStack.tsx'

export const RowStackWidget: React.FC = observer(() => {
  const { rowId } = useParams<{ rowId?: string }>()
  const manager = useViewModel(RowStackManager, rowId)

  return (
    <>
      {manager.stack.map((item) => (
        <RowStack key={item.id} item={item} />
      ))}
    </>
  )
})
