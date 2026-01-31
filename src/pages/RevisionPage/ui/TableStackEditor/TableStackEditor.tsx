import { observer } from 'mobx-react-lite'
import React from 'react'
import { SchemaEditor } from '@revisium/schema-toolkit-ui'
import { TableEditorItem } from 'src/pages/RevisionPage/model/items'
import { SelectingForeignKeyDivider } from 'src/pages/RevisionPage/ui/SelectingForeignKeyDivider/SelectingForeignKeyDivider.tsx'

interface Props {
  item: TableEditorItem
}

export const TableStackEditor: React.FC<Props> = observer(({ item }) => {
  return (
    <>
      {item.isSelectingForeignKey && <SelectingForeignKeyDivider />}
      <SchemaEditor model={item.viewModel} />
    </>
  )
})
