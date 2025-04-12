import { observer } from 'mobx-react-lite'
import React, { useCallback, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffectOnce } from 'react-use'
import { RowDataCardStore } from 'src/entities/Schema/model/row-data-card.store.ts'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'
import { RowDataCard } from 'src/entities/Schema/ui/RowDataCard/RowDataCard.tsx'
import { RowStringEditor } from 'src/entities/Schema/ui/RowStringEditor/RowStringEditor.tsx'
import { RowEditorActions, RowEditorMode } from 'src/features/CreateRowCard/model/RowEditorActions.ts'
import { ApproveButton } from 'src/shared/ui'
import { BackButton2 } from 'src/shared/ui/BackButton2/BackButton2.tsx'
import { RevertButton } from 'src/shared/ui/RevertButton/RevertButton.tsx'

interface EditRowDataCardProps {
  store: RowDataCardStore
  isEdit: boolean
  onUpdate: () => Promise<void>
  onSelectForeignKey: (node: JsonStringValueStore) => Promise<void>
}

export const EditRowDataCard: React.FC<EditRowDataCardProps> = observer(
  ({ store, isEdit, onUpdate, onSelectForeignKey }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [isLoading, setIsLoading] = useState(false)

    const handleClick = useCallback(async () => {
      setIsLoading(true)
      await onUpdate()
      setIsLoading(false)
    }, [onUpdate])

    const handleRevert = useCallback(() => {
      store.reset()
    }, [store])

    const handleBack = useCallback(() => {
      if (location.state?.isBackToRow) {
        navigate(-1)
      } else {
        navigate('..')
      }
    }, [location.state?.isBackToRow, navigate])

    useEffectOnce(() => {
      if (store.scrollPosition) {
        window.scrollTo(0, store.scrollPosition)
        store.setScrollPosition(null)
      }
    })

    const handleSelectForeignKey = useCallback(
      async (node: JsonStringValueStore) => {
        store.setScrollPosition(window.scrollY)
        await onSelectForeignKey(node)
      },
      [onSelectForeignKey, store],
    )

    return (
      <RowEditorActions.Provider
        value={{
          onSelectForeignKey: handleSelectForeignKey,
          onOverNode: store.setOverNode,
          mode: isEdit ? RowEditorMode.Updating : RowEditorMode.Reading,
        }}
      >
        <RowDataCard
          store={store}
          rootName="<id>"
          rootValue={<RowStringEditor dataTestId="0" store={store.name} readonly={!isEdit} />}
          actions={
            <>
              <BackButton2 dataTestId="back-to-row-list-button" onClick={handleBack} />
              {isEdit && (
                <ApproveButton
                  dataTestId="row-editor-approve-button"
                  isDisabled={!store.touched || !store.isValid}
                  loading={isLoading}
                  onClick={handleClick}
                />
              )}
              {isEdit && store.touched && <RevertButton dataTestId="row-editor-revert-button" onClick={handleRevert} />}
            </>
          }
          isEdit={isEdit}
        />
      </RowEditorActions.Provider>
    )
  },
)
