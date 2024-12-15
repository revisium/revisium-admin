import { Box } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { CreateTableButton } from 'src/features/CreateTableButton'
import { StringReferenceNodeStore } from 'src/features/SchemaEditor/model/StringReferenceNodeStore.ts'
import { SchemaEditorMode } from 'src/features/SchemaEditor/model/SchemaEditorActions.ts'
import { SchemaEditor } from 'src/features/SchemaEditor/ui/SchemaEditor/SchemaEditor.tsx'
import { TableStackModelStateType } from 'src/pages/RevisionPage/model/TableStackModel.ts'
import { useTableStackModel } from 'src/pages/RevisionPage/model/TableStackModelContext.ts'
import { SelectingReferenceDivider } from 'src/pages/RevisionPage/ui/SelectingReferenceDivider/SelectingRefrenceDivider.tsx'
import { ShortSchemaEditor } from 'src/pages/RevisionPage/ui/ShoreSchemaEditor/ShortSchemaEditor.tsx'
import { TableList } from 'src/widgets/TableList'

export const TableStack: React.FC = observer(() => {
  const { root, item } = useTableStackModel()

  const handleSelectReference = useCallback(
    (node: StringReferenceNodeStore) => {
      root.selectReference(item, node)
    },
    [item, root],
  )

  const handleCancelSelectReference = useCallback(() => {
    root.cancelSelectingReference(item)
  }, [item, root])

  const handleApprove = useCallback(async () => {
    if (item.state.type === TableStackModelStateType.CreatingTable) {
      const store = item.state.store
      const result = await item.createTable(store.tableId, store.getPlainSchema())

      if (result) {
        store.submitChanges()

        if (item.state.isSelectingReference) {
          root.onSelectedReference(item, store.tableId)
        } else {
          item.toUpdatingTableFromCreatingTable()
        }
      }
    }
  }, [item, root])

  const handleUpdate = useCallback(async () => {
    if (item.state.type === TableStackModelStateType.UpdatingTable) {
      const store = item.state.store
      const result = await item.updateTable(store.tableId, store.getPatches())
      if (result) {
        store.submitChanges()
      }
    }
  }, [item])

  const handleSelectTable = useCallback(
    (tableId: string) => {
      root.onSelectedReference(item, tableId)
    },
    [item, root],
  )

  if (item.state.type === TableStackModelStateType.ConnectingReferenceTable) {
    const schemaStore = item.state.store

    return (
      <>
        <ShortSchemaEditor
          previousType={item.state.previousType}
          referencePath={item.currentReferencePath}
          onCancel={handleCancelSelectReference}
          tableId={schemaStore.tableId}
        />
      </>
    )
  }

  if (item.state.type === TableStackModelStateType.List) {
    return (
      <>
        {item.state.isSelectingReference && <SelectingReferenceDivider />}
        <CreateTableButton onClick={item.toCreatingTable} />

        <Box paddingTop="0.5rem" paddingBottom="1rem">
          <TableList
            onSettings={item.toUpdatingTable}
            onSelect={item.state.isSelectingReference ? handleSelectTable : undefined}
          />
        </Box>
      </>
    )
  }

  if (item.state.type === TableStackModelStateType.CreatingTable) {
    const schemaStore = item.state.store

    return (
      <>
        {item.state.isSelectingReference && <SelectingReferenceDivider />}
        <SchemaEditor
          store={schemaStore}
          mode={SchemaEditorMode.Creating}
          onApprove={handleApprove}
          onCancel={item.toList}
          onSelectReference={handleSelectReference}
        />
      </>
    )
  }

  if (item.state.type === TableStackModelStateType.UpdatingTable) {
    const schemaStore = item.state.store

    return (
      <>
        {item.state.isSelectingReference && <SelectingReferenceDivider />}
        <SchemaEditor
          store={schemaStore}
          mode={SchemaEditorMode.Updating}
          isEditingMode
          onApprove={handleUpdate}
          onCancel={item.toList}
          onSelectReference={handleSelectReference}
        />
      </>
    )
  }

  return null
})
