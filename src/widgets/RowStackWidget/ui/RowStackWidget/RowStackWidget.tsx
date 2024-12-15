import { observer } from 'mobx-react-lite'
import React from 'react'
import { useRowStackWidgetModel } from 'src/widgets/RowStackWidget/hooks/useRowStackWidgetModel.ts'
import { RowStackModelContext } from 'src/widgets/RowStackWidget/model/RowStackModelContext.ts'
import { RowStack } from 'src/widgets/RowStackWidget/ui/RowStack/RowStack.tsx'

interface RowStackWidgetProps {
  startWithUpdating?: boolean
}

export const RowStackWidget: React.FC<RowStackWidgetProps> = observer(({ startWithUpdating }) => {
  const store = useRowStackWidgetModel(startWithUpdating)

  return (
    <>
      {store.stack.map((item) => (
        <RowStackModelContext.Provider
          key={item.id}
          value={{
            root: store,
            item,
          }}
        >
          <RowStack />
        </RowStackModelContext.Provider>
      ))}
    </>
  )
})
