import { observer } from 'mobx-react-lite'
import React, { useCallback, useState } from 'react'
import { useEffectOnce } from 'react-use'
import { RowDataCardStore } from 'src/entities/Schema/model/row-data-card.store.ts'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'
import { RowDataCard } from 'src/entities/Schema/ui/RowDataCard/RowDataCard.tsx'
import { RowEditorActions, RowEditorMode } from 'src/features/CreateRowCard/model/RowEditorActions.ts'

import { ApproveButton, CloseButton } from 'src/shared/ui'

interface CreateRowCardProps {
  store: RowDataCardStore
  onCancel?: () => void
  onAdd: () => Promise<void>
  onSelectForeignKey: (node: JsonStringValueStore, isCreating?: boolean) => Promise<void>
}

export const CreateRowCard: React.FC<CreateRowCardProps> = observer(
  ({ store, onCancel, onAdd, onSelectForeignKey }) => {
    const [isLoading, setIsLoading] = useState(false)

    const handleAdd = useCallback(async () => {
      setIsLoading(true)
      await onAdd()
      setIsLoading(false)
    }, [onAdd])

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
          onSelectForeignKey: handleSelectForeignKey,
          onOverNode: store.setOverNode,
          mode: RowEditorMode.Creating,
        }}
      >
        <RowDataCard
          store={store}
          rootName="<id>"
          actions={
            <>
              <CloseButton dataTestId="close-create-row-button" onClick={onCancel} />
              <ApproveButton
                dataTestId="approve-create-row-button"
                loading={isLoading}
                onClick={handleAdd}
                isDisabled={!store.root.isValid}
              />
            </>
          }
          isEdit
        />
      </RowEditorActions.Provider>
    )
  },
)
