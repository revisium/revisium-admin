import { observer } from 'mobx-react-lite'
import React from 'react'
import { SchemaEditor, SchemaEditorMode } from 'src/widgets/SchemaEditor'
import { TableEditorItem } from 'src/pages/RevisionPage/model/items'
import { TableStackItemType } from 'src/pages/RevisionPage/config/types.ts'
import { SelectingForeignKeyDivider } from 'src/pages/RevisionPage/ui/SelectingForeignKeyDivider/SelectingForeignKeyDivider.tsx'

interface Props {
  item: TableEditorItem
}

export const TableStackEditor: React.FC<Props> = observer(({ item }) => {
  const mode = item.type === TableStackItemType.Creating ? SchemaEditorMode.Creating : SchemaEditorMode.Updating

  return (
    <>
      {item.isSelectingForeignKey && <SelectingForeignKeyDivider />}
      <SchemaEditor
        store={item.store}
        mode={mode}
        onApprove={item.approve}
        onCancel={item.toList}
        onSelectForeignKey={item.startForeignKeySelection}
      />
    </>
  )
})
