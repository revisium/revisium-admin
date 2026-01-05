import { observer } from 'mobx-react-lite'
import React from 'react'
import { RowPageDataQuery } from 'src/__generated__/graphql-request.ts'
import { useRowStackWidgetModel } from 'src/widgets/RowStackWidget/hooks/useRowStackWidgetModel.ts'
import { RowStackModelContext } from 'src/widgets/RowStackWidget/model/RowStackModelContext.ts'
import { RowStack } from 'src/widgets/RowStackWidget/ui/RowStack/RowStack.tsx'

type RowPageRow = NonNullable<RowPageDataQuery['row']>
type RowPageTable = NonNullable<RowPageDataQuery['table']>

interface RowStackWidgetProps {
  row?: RowPageRow
  table?: RowPageTable
  foreignKeysCount?: number
  startWithUpdating?: boolean
}

export const RowStackWidget: React.FC<RowStackWidgetProps> = observer(
  ({ row, table, foreignKeysCount = 0, startWithUpdating }) => {
    const rowData = row && table ? { row, table, foreignKeysCount } : null
    const store = useRowStackWidgetModel(rowData, startWithUpdating)

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
  },
)
