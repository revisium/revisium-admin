import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { useEffectOnce } from 'react-use'
import { RowDataCardStore } from 'src/entities/Schema/model/row-data-card.store.ts'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'
import { RowDataCard } from 'src/entities/Schema/ui/RowDataCard/RowDataCard.tsx'
import { RowEditorActions, RowEditorMode } from 'src/features/CreateRowCard/model/RowEditorActions.ts'

interface EditRowDataCardProps {
  store: RowDataCardStore
  tableId: string
  isEdit: boolean
  onSelectForeignKey: (node: JsonStringValueStore, isCreating?: boolean) => Promise<void>
  onUploadFile: (fileId: string, file: File) => Promise<void>
}

export const EditRowDataCard: React.FC<EditRowDataCardProps> = observer(
  ({ store, tableId, isEdit, onSelectForeignKey, onUploadFile }) => {
    useEffectOnce(() => {
      if (store.scrollPosition) {
        window.scrollTo(0, store.scrollPosition)
        store.setScrollPosition(null)
      }
    })

    const handleSelectForeignKey = useCallback(
      async (node: JsonStringValueStore, isCreating?: boolean) => {
        store.setScrollPosition(window.scrollY)
        await onSelectForeignKey(node, isCreating)
      },
      [onSelectForeignKey, store],
    )

    return (
      <RowEditorActions.Provider
        value={{
          onUploadFile,
          onSelectForeignKey: handleSelectForeignKey,
          onOverNode: store.setOverNode,
          mode: isEdit ? RowEditorMode.Updating : RowEditorMode.Reading,
        }}
      >
        <RowDataCard store={store} tableId={tableId} isEdit={isEdit} />
      </RowEditorActions.Provider>
    )
  },
)
