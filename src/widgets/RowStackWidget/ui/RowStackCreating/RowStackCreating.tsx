import { Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLinkMaker } from 'src/entities/Navigation/hooks/useLinkMaker.ts'
import { ViewerSwitcherMode } from 'src/entities/Schema'
import { RowViewerSwitcher } from 'src/entities/Schema/ui/RowViewerSwitcher/RowViewerSwitcher.tsx'
import { CreateRowCard } from 'src/features/CreateRowCard'
import { RowCreatingItem } from 'src/pages/RowPage/model/items'
import { DRAFT_TAG } from 'src/shared/config/routes.ts'
import { ApproveButton, CloseButton, toaster } from 'src/shared/ui'
import { RowActionsMenu } from 'src/widgets/RowStackWidget/ui/RowActionsMenu/RowActionsMenu.tsx'
import { RowIdInput } from 'src/widgets/RowStackWidget/ui/RowIdInput/RowIdInput.tsx'
import { RowStackHeader } from 'src/widgets/RowStackWidget/ui/RowStackHeader/RowStackHeader.tsx'
import { SelectingForeignKeyDivider } from 'src/widgets/RowStackWidget/ui/SelectingForeignKeyDivider/SelectingForeignKeyDivider.tsx'

interface Props {
  item: RowCreatingItem
}

export const RowStackCreating: React.FC<Props> = observer(({ item }) => {
  const navigate = useNavigate()
  const linkMaker = useLinkMaker()

  const store = item.store
  const effectiveViewMode = store.viewMode || ViewerSwitcherMode.Tree

  const handleCreateRow = useCallback(async () => {
    try {
      const createdRowId = await item.approve()

      if (createdRowId && !item.isSelectingForeignKey) {
        navigate(linkMaker.make({ revisionIdOrTag: DRAFT_TAG, rowId: createdRowId }))
      }
    } catch {
      toaster.error({ title: 'Create failed' })
    }
  }, [item, linkMaker, navigate])

  const handleCopyJson = useCallback(async () => {
    const json = item.getJsonString()
    await navigator.clipboard.writeText(json)
    toaster.info({ title: 'Copied to clipboard' })
  }, [item])

  const actions = (
    <Flex gap="4px">
      <CloseButton dataTestId="close-create-row-button" onClick={item.toList} />
      <ApproveButton
        dataTestId="approve-create-row-button"
        loading={item.isLoading}
        onClick={handleCreateRow}
        isDisabled={!store.root.isValid}
      />
    </Flex>
  )

  const switcher = (
    <RowViewerSwitcher availableRefByMode={false} mode={effectiveViewMode} onChange={store.setViewMode} />
  )

  const rowIdInput = <RowIdInput value={store.name.value} setValue={item.setRowName} dataTestId="row-id-input" />

  const isTreeMode = effectiveViewMode === ViewerSwitcherMode.Tree
  const showTreeActions = isTreeMode && store.node.hasCollapsibleContent

  const actionsMenu = isTreeMode ? (
    <RowActionsMenu
      showTreeActions={showTreeActions}
      onExpandAll={() => store.node.expandAllContent()}
      onCollapseAll={() => store.node.collapseAllContent()}
      onCopyJson={handleCopyJson}
    />
  ) : null

  return (
    <Flex flexDirection="column" flex={1}>
      {item.isSelectingForeignKey && <SelectingForeignKeyDivider tableId={item.tableId} />}
      <RowStackHeader
        showBreadcrumbs={item.showBreadcrumbs}
        rowIdInput={rowIdInput}
        actions={actions}
        actionsMenu={actionsMenu}
        switcher={switcher}
      />
      <Flex flexDirection="column" paddingTop="60px">
        <CreateRowCard
          store={store}
          tableId={item.tableId}
          onSelectForeignKey={item.handleSelectForeignKey}
          onCreateAndConnectForeignKey={item.handleCreateAndConnectForeignKey}
        />
      </Flex>
    </Flex>
  )
})
