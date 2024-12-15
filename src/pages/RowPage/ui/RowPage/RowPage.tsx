import { observer } from 'mobx-react-lite'
import React from 'react'
import { UnsupportedSchemaForRow } from 'src/features/UnsupportedSchemaForRow/ui/UnsupportedSchemaForRow/UnsupportedSchemaForRow.tsx'
import { useRowPageModel } from 'src/pages/RowPage/hooks/useRowPageModel.ts'
import { RowStackWidget } from 'src/widgets/RowStackWidget/ui/RowStackWidget/RowStackWidget.tsx'

export const RowPage: React.FC = observer(() => {
  const store = useRowPageModel()

  if (!store.isValidSchema) {
    return <UnsupportedSchemaForRow data={store.row.data} />
  }

  return <RowStackWidget startWithUpdating />
})
