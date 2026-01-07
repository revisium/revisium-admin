import { Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { ViewerSwitcherMode } from 'src/entities/Schema'
import { RowViewerSwitcher } from 'src/entities/Schema/ui/RowViewerSwitcher/RowViewerSwitcher.tsx'
import { CreateRowCard } from 'src/features/CreateRowCard'
import { RowCreatingItem } from 'src/pages/RowPage/model/items'
import { ApproveButton, CloseButton } from 'src/shared/ui'
import { RowActionsMenu } from 'src/widgets/RowStackWidget/ui/RowActionsMenu/RowActionsMenu.tsx'
import { RowIdInput } from 'src/widgets/RowStackWidget/ui/RowIdInput/RowIdInput.tsx'
import { RowStackHeader } from 'src/widgets/RowStackWidget/ui/RowStackHeader/RowStackHeader.tsx'
import { SelectingForeignKeyDivider } from 'src/widgets/RowStackWidget/ui/SelectingForeignKeyDivider/SelectingForeignKeyDivider.tsx'

interface Props {
  item: RowCreatingItem
}

export const RowStackCreating: React.FC<Props> = observer(({ item }) => {
  const store = item.store
  const effectiveViewMode = store.viewMode || ViewerSwitcherMode.Tree

  const actions = (
    <Flex gap="4px">
      <CloseButton dataTestId="close-create-row-button" onClick={item.toList} />
      <ApproveButton
        dataTestId="approve-create-row-button"
        loading={item.isLoading}
        onClick={item.approveAndNavigate}
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
      onCopyJson={item.copyJsonToClipboard}
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
