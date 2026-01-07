import { observer } from 'mobx-react-lite'
import React from 'react'
import { RowStackManager } from 'src/pages/RowPage/model'
import { useViewModel } from 'src/shared/lib/hooks/useViewModel.ts'
import { RowStack } from 'src/widgets/RowStackWidget/ui/RowStack/RowStack.tsx'

export const RowStackWidget: React.FC = observer(() => {
  const manager = useViewModel(RowStackManager)

  return (
    <>
      {manager.stack.map((item) => (
        <RowStack key={item.id} item={item} />
      ))}
    </>
  )
})
