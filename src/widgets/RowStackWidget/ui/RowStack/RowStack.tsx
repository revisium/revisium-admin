import { Box } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLinkMaker } from 'src/entities/Navigation/hooks/useLinkMaker.ts'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'
import { CreateRowButton } from 'src/features/CreateRowButton'
import { CreateRowCard } from 'src/features/CreateRowCard'
import { EditRowDataCard } from 'src/features/EditRowDataCard'

import { RowStackModelStateType } from 'src/widgets/RowStackWidget/model/RowStackModel.ts'
import { useRowStackModel } from 'src/widgets/RowStackWidget/model/RowStackModelContext.ts'
import { SelectingReferenceDivider } from 'src/widgets/RowStackWidget/ui/SelectingReferenceDivider/SelectingRefrenceDivider.tsx'
import { ShortRowEditor } from 'src/widgets/RowStackWidget/ui/ShortRowEditor/ShortRowEditor.tsx'
import { RowList } from 'src/widgets/RowList'

export const RowStack: React.FC = observer(() => {
  const navigate = useNavigate()
  const linkMaker = useLinkMaker()
  const { root, item } = useRowStackModel()

  const handleSelectReference = useCallback(
    async (node: JsonStringValueStore) => {
      await root.selectReference(item, node)
    },
    [item, root],
  )

  const handleCancelSelectReference = useCallback(() => {
    root.cancelSelectingReference(item)
  }, [item, root])

  const handleSelectRow = useCallback(
    (rowId: string) => {
      root.onSelectedReference(item, rowId)
    },
    [item, root],
  )

  const handleCreateRow = useCallback(async () => {
    if (item.state.type === RowStackModelStateType.CreatingRow) {
      const store = item.state.store
      const createdRow = await item.createRow(store.name.getPlainValue(), store.root.getPlainValue())

      if (createdRow) {
        if (item.state.isSelectingReference) {
          root.onSelectedReference(item, store.name.getPlainValue())
        } else {
          navigate(linkMaker.make({ isDraft: true, rowId: createdRow.id }))
        }
      }
    }
  }, [item, linkMaker, navigate, root])

  const handleUpdateRow = useCallback(async () => {
    if (item.state.type === RowStackModelStateType.UpdatingRow) {
      const store = item.state.store
      const result = await item.updateRow(store.root.getPlainValue())
      if (result) {
        store.save()
      }
    }
  }, [item])

  if (item.state.type === RowStackModelStateType.ConnectingReferenceRow) {
    const schemaStore = item.state.store

    return (
      <>
        <ShortRowEditor
          previousType={item.state.previousType}
          referencePath={item.currentReferencePath}
          onCancel={handleCancelSelectReference}
          tableId={item.table.id}
          rowId={schemaStore.name.getPlainValue()}
        />
      </>
    )
  }

  if (item.state.type === RowStackModelStateType.List) {
    return (
      <>
        {item.state.isSelectingReference && <SelectingReferenceDivider tableId={item.table.id} />}
        <CreateRowButton onClick={item.toCreatingRow} />
        <Box paddingTop="0.5rem" paddingBottom="1rem">
          <RowList table={item.table} onSelect={item.state.isSelectingReference ? handleSelectRow : undefined} />
        </Box>
      </>
    )
  }

  if (item.state.type === RowStackModelStateType.CreatingRow) {
    return (
      <>
        {item.state.isSelectingReference && <SelectingReferenceDivider tableId={item.table.id} />}
        <CreateRowCard
          store={item.state.store}
          onAdd={handleCreateRow}
          onCancel={item.toList}
          onSelectReference={handleSelectReference}
        />
      </>
    )
  }

  if (item.state.type === RowStackModelStateType.UpdatingRow) {
    return (
      <>
        {item.state.isSelectingReference && <SelectingReferenceDivider tableId={item.table.id} />}
        <EditRowDataCard
          isEdit={item.isEditableRevision}
          store={item.state.store}
          onUpdate={handleUpdateRow}
          onSelectReference={handleSelectReference}
        />
      </>
    )
  }

  return null
})
