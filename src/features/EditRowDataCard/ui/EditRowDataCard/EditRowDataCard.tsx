import { observer } from 'mobx-react-lite'
import React, { useCallback, useState } from 'react'
import { useEffectOnce } from 'react-use'
import { RowDataCardStore } from 'src/entities/Schema/model/row-data-card.store.ts'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'
import { RowDataCard } from 'src/entities/Schema/ui/RowDataCard/RowDataCard.tsx'
import { RowEditorActions, RowEditorMode } from 'src/features/CreateRowCard/model/RowEditorActions.ts'
import { ApproveButton } from 'src/shared/ui'
import { RevertButton } from 'src/shared/ui/RevertButton/RevertButton.tsx'

interface EditRowDataCardProps {
  store: RowDataCardStore
  isEdit: boolean
  onUpdate: () => Promise<void>
  onSelectForeignKey: (node: JsonStringValueStore, isCreating?: boolean) => Promise<void>
  onUploadFile: (fileId: string, file: File) => Promise<void>
}

export const EditRowDataCard: React.FC<EditRowDataCardProps> = observer(
  ({ store, isEdit, onUpdate, onSelectForeignKey, onUploadFile }) => {
    const [isLoading, setIsLoading] = useState(false)

    const handleClick = useCallback(async () => {
      setIsLoading(true)
      await onUpdate()
      setIsLoading(false)
    }, [onUpdate])

    const handleRevert = useCallback(() => {
      store.reset()
    }, [store])

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
        <RowDataCard
          store={store}
          rootName="<id>"
          actions={
            <>
              {store.touched && (
                <ApproveButton
                  dataTestId="row-editor-approve-button"
                  isDisabled={!store.isValid}
                  loading={isLoading}
                  onClick={handleClick}
                />
              )}
              {store.touched && <RevertButton dataTestId="row-editor-revert-button" onClick={handleRevert} />}
            </>
          }
          isEdit={isEdit}
        />
      </RowEditorActions.Provider>
    )
  },
)
