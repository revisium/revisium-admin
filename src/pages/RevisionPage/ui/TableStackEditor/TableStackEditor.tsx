import { observer } from 'mobx-react-lite'
import React from 'react'
import { CreatingSchemaEditor, UpdatingSchemaEditor } from '@revisium/schema-toolkit-ui'
import { TableEditorItem } from 'src/pages/RevisionPage/model/items'
import { TableCreatingItem } from 'src/pages/RevisionPage/model/items'
import { SelectingForeignKeyDivider } from 'src/pages/RevisionPage/ui/SelectingForeignKeyDivider/SelectingForeignKeyDivider.tsx'

interface Props {
  item: TableEditorItem
}

export const TableStackEditor: React.FC<Props> = observer(({ item }) => {
  return (
    <>
      {item.isSelectingForeignKey && <SelectingForeignKeyDivider />}
      {item instanceof TableCreatingItem ? (
        <CreatingSchemaEditor vm={item.viewModel} />
      ) : (
        <UpdatingSchemaEditor vm={item.viewModel} />
      )}
    </>
  )
})
