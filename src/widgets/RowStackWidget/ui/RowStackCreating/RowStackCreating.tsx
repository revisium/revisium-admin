import { Box, Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLinkMaker } from 'src/entities/Navigation/hooks/useLinkMaker.ts'
import { ViewerSwitcherMode } from 'src/entities/Schema'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'
import { RowViewerSwitcher } from 'src/entities/Schema/ui/RowViewerSwitcher/RowViewerSwitcher.tsx'
import { CreateRowCard } from 'src/features/CreateRowCard'
import { DRAFT_TAG } from 'src/shared/config/routes.ts'
import { ApproveButton, CloseButton } from 'src/shared/ui'

import { RowStackModelStateType } from 'src/widgets/RowStackWidget/model/RowStackModel.ts'
import { useRowStackModel } from 'src/widgets/RowStackWidget/model/RowStackModelContext.ts'
import { RowStackHeader } from 'src/widgets/RowStackWidget/ui/RowStackHeader/RowStackHeader.tsx'
import { SelectingForeignKeyDivider } from 'src/widgets/RowStackWidget/ui/SelectingForeignKeyDivider/SelectingForeignKeyDivider.tsx'

export const RowStackCreating: React.FC = observer(() => {
  const navigate = useNavigate()
  const linkMaker = useLinkMaker()
  const { root, item } = useRowStackModel()

  const [isLoading, setIsLoading] = useState(false)

  const isFirstLevel = root.stack.indexOf(item) === 0
  const showBreadcrumbs = isFirstLevel && !item.state.isSelectingForeignKey

  const handleSelectForeignKey = useCallback(
    async (node: JsonStringValueStore, isCreating?: boolean) => {
      await root.selectForeignKey(item, node, isCreating)
    },
    [item, root],
  )

  const handleCreateRow = useCallback(async () => {
    if (item.state.type !== RowStackModelStateType.CreatingRow) return

    const store = item.state.store
    setIsLoading(true)
    const createdRow = await item.createRow(store.name.getPlainValue(), store.root.getPlainValue())
    setIsLoading(false)

    if (createdRow) {
      if (item.state.isSelectingForeignKey) {
        root.onSelectedForeignKey(item, store.name.getPlainValue())
      } else {
        navigate(linkMaker.make({ revisionIdOrTag: DRAFT_TAG, rowId: createdRow.id }))
      }
    }
  }, [item, linkMaker, navigate, root])

  if (item.state.type !== RowStackModelStateType.CreatingRow) {
    return null
  }

  const store = item.state.store

  const actions = (
    <Flex gap="4px">
      <CloseButton dataTestId="close-create-row-button" onClick={item.toList} />
      <ApproveButton
        dataTestId="approve-create-row-button"
        loading={isLoading}
        onClick={handleCreateRow}
        isDisabled={!store.root.isValid}
      />
    </Flex>
  )

  const switcher = (
    <RowViewerSwitcher
      availableRefByMode={false}
      mode={store.viewMode || ViewerSwitcherMode.Tree}
      onChange={store.setViewMode}
    />
  )

  return (
    <Flex flexDirection="column" flex={1}>
      {item.state.isSelectingForeignKey && <SelectingForeignKeyDivider tableId={item.table.id} />}
      <RowStackHeader showBreadcrumbs={showBreadcrumbs} actions={actions} switcher={switcher} />
      <Box paddingTop="1rem">
        <CreateRowCard store={store} onSelectForeignKey={handleSelectForeignKey} />
      </Box>
    </Flex>
  )
})
