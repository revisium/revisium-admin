import { Box } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { CreateTableButton } from 'src/features/CreateTableButton'
import { container } from 'src/shared/lib'
import { PermissionContext } from 'src/shared/model/AbilityService'
import { useProjectPageModel } from 'src/shared/model/ProjectPageModel/hooks/useProjectPageModel.ts'
import { SchemaEditor, StringForeignKeyNodeStore, SchemaEditorMode } from 'src/widgets/SchemaEditor'
import { TableStackModelStateType } from 'src/pages/RevisionPage/model/TableStackModel.ts'
import { useTableStackModel } from 'src/pages/RevisionPage/model/TableStackModelContext.ts'
import { SelectingForeignKeyDivider } from 'src/pages/RevisionPage/ui/SelectingForeignKeyDivider/SelectingForeignKeyDivider.tsx'
import { ShortSchemaEditor } from 'src/pages/RevisionPage/ui/ShoreSchemaEditor/ShortSchemaEditor.tsx'
import { TableList } from 'src/widgets/TableList'

export const TableStack: React.FC = observer(() => {
  const projectPageModel = useProjectPageModel()
  const permissionContext = container.get(PermissionContext)
  const { root, item } = useTableStackModel()

  const canCreateTable = projectPageModel.isEditableRevision && permissionContext.canCreateTable

  const handleSelectForeignKey = useCallback(
    (node: StringForeignKeyNodeStore) => {
      root.selectForeignKey(item, node)
    },
    [item, root],
  )

  const handleCancelSelectForeignKey = useCallback(() => {
    root.cancelSelectingForeignKey(item)
  }, [item, root])

  const handleApprove = useCallback(async () => {
    if (item.state.type === TableStackModelStateType.CreatingTable) {
      const store = item.state.store
      const result = await item.createTable(store.draftTableId, store.getPlainSchema())

      if (result) {
        store.submitChanges()

        if (item.state.isSelectingForeignKey) {
          root.onSelectedForeignKey(item, store.draftTableId)
        } else {
          item.toUpdatingTableFromCreatingTable()
        }
      }
    }
  }, [item, root])

  const handleUpdate = useCallback(async () => {
    if (item.state.type === TableStackModelStateType.UpdatingTable) {
      const store = item.state.store
      const result = await item.updateTable(store)
      if (result) {
        store.submitChanges()
      }
    }
  }, [item])

  const handleSelectTable = useCallback(
    (tableId: string) => {
      root.onSelectedForeignKey(item, tableId)
    },
    [item, root],
  )

  if (item.state.type === TableStackModelStateType.ConnectingForeignKeyTable) {
    const schemaStore = item.state.store

    return (
      <>
        <ShortSchemaEditor
          previousType={item.state.previousType}
          foreignKeyPath={item.currentForeignKeyPath}
          onCancel={handleCancelSelectForeignKey}
          tableId={schemaStore.draftTableId}
        />
      </>
    )
  }

  if (item.state.type === TableStackModelStateType.List) {
    return (
      <>
        {item.state.isSelectingForeignKey && <SelectingForeignKeyDivider />}
        {canCreateTable && <CreateTableButton onClick={item.toCreatingTable} />}

        <Box paddingTop="0.5rem" paddingBottom="1rem">
          <TableList
            onSettings={item.toUpdatingTable}
            onCopy={item.toCloningTable}
            onSelect={item.state.isSelectingForeignKey ? handleSelectTable : undefined}
          />
        </Box>
      </>
    )
  }

  if (item.state.type === TableStackModelStateType.CreatingTable) {
    const schemaStore = item.state.store

    return (
      <>
        {item.state.isSelectingForeignKey && <SelectingForeignKeyDivider />}
        <SchemaEditor
          store={schemaStore}
          mode={SchemaEditorMode.Creating}
          onApprove={handleApprove}
          onCancel={item.toList}
          onSelectForeignKey={handleSelectForeignKey}
        />
      </>
    )
  }

  if (item.state.type === TableStackModelStateType.UpdatingTable) {
    const schemaStore = item.state.store

    return (
      <>
        {item.state.isSelectingForeignKey && <SelectingForeignKeyDivider />}
        <SchemaEditor
          store={schemaStore}
          mode={SchemaEditorMode.Updating}
          onApprove={handleUpdate}
          onCancel={item.toList}
          onSelectForeignKey={handleSelectForeignKey}
        />
      </>
    )
  }

  return null
})
