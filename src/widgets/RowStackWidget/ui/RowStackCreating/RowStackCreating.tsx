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
import { ApproveButton, CloseButton, toaster } from 'src/shared/ui'

import { RowStackModelStateType } from 'src/widgets/RowStackWidget/model/RowStackModel.ts'
import { useRowStackModel } from 'src/widgets/RowStackWidget/model/RowStackModelContext.ts'
import { RowIdInput } from 'src/widgets/RowStackWidget/ui/RowIdInput/RowIdInput.tsx'
import { RowStackHeader } from 'src/widgets/RowStackWidget/ui/RowStackHeader/RowStackHeader.tsx'
import { SelectingForeignKeyDivider } from 'src/widgets/RowStackWidget/ui/SelectingForeignKeyDivider/SelectingForeignKeyDivider.tsx'
import { TreeCollapseButtons } from 'src/widgets/RowStackWidget/ui/TreeCollapseButtons/TreeCollapseButtons.tsx'

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

  const handleSetRowName = useCallback(
    (value: string) => {
      if (item.state.type === RowStackModelStateType.CreatingRow) {
        item.state.store.name.setValue(value)
      }
    },
    [item],
  )

  const handleCreateRow = useCallback(async () => {
    if (item.state.type !== RowStackModelStateType.CreatingRow) return

    const store = item.state.store
    setIsLoading(true)

    try {
      const createdRow = await item.createRow(store.name.getPlainValue(), store.root.getPlainValue())

      if (createdRow) {
        if (item.state.isSelectingForeignKey) {
          root.onSelectedForeignKey(item, store.name.getPlainValue())
        } else {
          navigate(linkMaker.make({ revisionIdOrTag: DRAFT_TAG, rowId: createdRow.id }))
        }
      }
    } catch {
      toaster.error({ title: 'Create failed' })
    } finally {
      setIsLoading(false)
    }
  }, [item, linkMaker, navigate, root])

  if (item.state.type !== RowStackModelStateType.CreatingRow) {
    return null
  }

  const store = item.state.store
  const effectiveViewMode = store.viewMode || ViewerSwitcherMode.Tree

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
    <RowViewerSwitcher availableRefByMode={false} mode={effectiveViewMode} onChange={store.setViewMode} />
  )

  const rowIdInput = <RowIdInput value={store.name.value} setValue={handleSetRowName} dataTestId="row-id-input" />

  const treeButtons =
    effectiveViewMode === ViewerSwitcherMode.Tree && store.node.hasCollapsibleContent ? (
      <TreeCollapseButtons
        onExpandAll={() => store.node.expandAllContent()}
        onCollapseAll={() => store.node.collapseAllContent()}
      />
    ) : null

  return (
    <Flex flexDirection="column" flex={1}>
      {item.state.isSelectingForeignKey && <SelectingForeignKeyDivider tableId={item.table.id} />}
      <RowStackHeader
        showBreadcrumbs={showBreadcrumbs}
        rowIdInput={rowIdInput}
        actions={actions}
        treeButtons={treeButtons}
        switcher={switcher}
      />
      <Box paddingTop="1rem">
        <CreateRowCard store={store} onSelectForeignKey={handleSelectForeignKey} />
      </Box>
    </Flex>
  )
})
