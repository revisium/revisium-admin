import { observer } from 'mobx-react-lite'
import React from 'react'
import { useEffectOnce } from 'react-use'
import { RowDataCardStore } from 'src/entities/Schema/model/row-data-card.store.ts'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'
import { RowDataCard } from 'src/entities/Schema/ui/RowDataCard/RowDataCard.tsx'
import { RowEditorActions, RowEditorMode } from 'src/features/CreateRowCard/model/RowEditorActions.ts'

interface CreateRowCardProps {
  store: RowDataCardStore
  tableId: string
  onSelectForeignKey: (node: JsonStringValueStore) => void
  onCreateAndConnectForeignKey: (node: JsonStringValueStore) => void
}

export const CreateRowCard: React.FC<CreateRowCardProps> = observer(
  ({ store, tableId, onSelectForeignKey, onCreateAndConnectForeignKey }) => {
    useEffectOnce(() => {
      if (store.scrollPosition) {
        window.scrollTo(0, store.scrollPosition)
        store.setScrollPosition(null)
      }
    })

    return (
      <RowEditorActions.Provider
        value={{
          onSelectForeignKey,
          onCreateAndConnectForeignKey,
          onOverNode: store.setOverNode,
          mode: RowEditorMode.Creating,
        }}
      >
        <RowDataCard store={store} tableId={tableId} isEdit />
      </RowEditorActions.Provider>
    )
  },
)
