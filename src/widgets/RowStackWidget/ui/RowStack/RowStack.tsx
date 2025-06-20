import { Box } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLinkMaker } from 'src/entities/Navigation/hooks/useLinkMaker.ts'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'
import { CreateRowButton } from 'src/features/CreateRowButton'
import { CreateRowCard } from 'src/features/CreateRowCard'
import { EditRowDataCard } from 'src/features/EditRowDataCard'
import { toaster } from 'src/shared/ui'
import { RowList } from 'src/widgets/RowList'

import { RowStackModelStateType } from 'src/widgets/RowStackWidget/model/RowStackModel.ts'
import { useRowStackModel } from 'src/widgets/RowStackWidget/model/RowStackModelContext.ts'
import { SelectingForeignKeyDivider } from 'src/widgets/RowStackWidget/ui/SelectingForeignKeyDivider/SelectingForeignKeyDivider.tsx'
import { ShortRowEditor } from 'src/widgets/RowStackWidget/ui/ShortRowEditor/ShortRowEditor.tsx'

export const RowStack: React.FC = observer(() => {
  const navigate = useNavigate()
  const linkMaker = useLinkMaker()
  const { root, item } = useRowStackModel()

  const handleSelectForeignKey = useCallback(
    async (node: JsonStringValueStore) => {
      await root.selectForeignKey(item, node)
    },
    [item, root],
  )

  const handleCancelSelectForeignKey = useCallback(() => {
    root.cancelSelectingForeignKey(item)
  }, [item, root])

  const handleSelectRow = useCallback(
    (rowId: string) => {
      root.onSelectedForeignKey(item, rowId)
    },
    [item, root],
  )

  const handleCreateRow = useCallback(async () => {
    if (item.state.type === RowStackModelStateType.CreatingRow) {
      const store = item.state.store
      const createdRow = await item.createRow(store.name.getPlainValue(), store.root.getPlainValue())

      if (createdRow) {
        if (item.state.isSelectingForeignKey) {
          root.onSelectedForeignKey(item, store.name.getPlainValue())
        } else {
          navigate(linkMaker.make({ isDraft: true, rowId: createdRow.id }))
        }
      }
    }
  }, [item, linkMaker, navigate, root])

  const handleUpdateRow = useCallback(async () => {
    if (item.state.type === RowStackModelStateType.UpdatingRow) {
      const store = item.state.store
      const result = await item.updateRow(store)
      if (result) {
        store.save()
        store.syncReadOnlyStores()
        navigate(linkMaker.make({ isDraft: true, rowId: store.name.getPlainValue() }))
      }
    }
  }, [item, linkMaker, navigate])

  const handleUploadFile = useCallback(
    async (fileId: string, file: File) => {
      if (item.state.type === RowStackModelStateType.UpdatingRow) {
        const store = item.state.store

        const toastId = nanoid()
        toaster.loading({ id: toastId, title: 'Uploading...' })
        const result = await item.uploadFile(store, fileId, file)

        if (result) {
          toaster.update(toastId, {
            type: 'info',
            title: 'Successfully uploaded!',
            duration: 1500,
          })
          store.syncReadOnlyStores()
          navigate(linkMaker.make({ isDraft: true, rowId: store.name.getPlainValue() }))
        } else {
          toaster.update(toastId, {
            type: 'info',
            title: 'Something wrong with the upload',
          })
        }
      }
    },
    [item, linkMaker, navigate],
  )

  if (item.state.type === RowStackModelStateType.ConnectingForeignKeyRow) {
    const schemaStore = item.state.store

    return (
      <ShortRowEditor
        previousType={item.state.previousType}
        foreignKeyPath={item.currentForeignKeyPath}
        onCancel={handleCancelSelectForeignKey}
        tableId={item.table.id}
        rowId={schemaStore.name.getPlainValue()}
      />
    )
  }

  if (item.state.type === RowStackModelStateType.List) {
    return (
      <>
        {item.state.isSelectingForeignKey && <SelectingForeignKeyDivider tableId={item.table.id} />}
        <CreateRowButton onClick={item.toCreatingRow} />
        <Box paddingTop="0.5rem" paddingBottom="1rem" height="100%">
          <RowList
            table={item.table}
            onSelect={item.state.isSelectingForeignKey ? handleSelectRow : undefined}
            onCopy={item.toCloneRow}
          />
        </Box>
      </>
    )
  }

  if (item.state.type === RowStackModelStateType.CreatingRow) {
    return (
      <>
        {item.state.isSelectingForeignKey && <SelectingForeignKeyDivider tableId={item.table.id} />}
        <CreateRowCard
          store={item.state.store}
          onAdd={handleCreateRow}
          onCancel={item.toList}
          onSelectForeignKey={handleSelectForeignKey}
        />
      </>
    )
  }

  if (item.state.type === RowStackModelStateType.UpdatingRow) {
    return (
      <>
        {item.state.isSelectingForeignKey && <SelectingForeignKeyDivider tableId={item.table.id} />}
        <EditRowDataCard
          isEdit={item.isEditableRevision}
          store={item.state.store}
          onUpdate={handleUpdateRow}
          onSelectForeignKey={handleSelectForeignKey}
          onUploadFile={handleUploadFile}
        />
      </>
    )
  }

  return null
})
