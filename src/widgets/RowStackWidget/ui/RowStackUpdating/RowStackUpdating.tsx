import { Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { ViewerSwitcherMode } from 'src/entities/Schema'
import { RowViewerSwitcher } from 'src/entities/Schema/ui/RowViewerSwitcher/RowViewerSwitcher.tsx'
import { EditRowDataCard } from 'src/features/EditRowDataCard'
import { RowUpdatingItem } from 'src/pages/RowPage/model/items'
import { ApproveButton } from 'src/shared/ui'
import { RevertButton } from 'src/shared/ui/RevertButton/RevertButton.tsx'
import { RowActionsMenu } from 'src/widgets/RowStackWidget/ui/RowActionsMenu/RowActionsMenu.tsx'
import { RowIdInput } from 'src/widgets/RowStackWidget/ui/RowIdInput/RowIdInput.tsx'
import { RowStackHeader } from 'src/widgets/RowStackWidget/ui/RowStackHeader/RowStackHeader.tsx'
import { SelectingForeignKeyDivider } from 'src/widgets/RowStackWidget/ui/SelectingForeignKeyDivider/SelectingForeignKeyDivider.tsx'

interface Props {
  item: RowUpdatingItem
}

export const RowStackUpdating: React.FC<Props> = observer(({ item }) => {
  const store = item.store
  const effectiveViewMode = store.viewMode || ViewerSwitcherMode.Tree

  const actions = store.touched ? (
    <Flex gap="4px">
      <ApproveButton
        dataTestId="row-editor-approve-button"
        isDisabled={!store.isValid}
        loading={item.isLoading}
        onClick={item.approveAndNavigate}
      />
      <RevertButton dataTestId="row-editor-revert-button" onClick={item.revert} />
    </Flex>
  ) : null

  const switcher = (
    <RowViewerSwitcher
      availableRefByMode={store.areThereForeignKeysBy}
      mode={effectiveViewMode}
      onChange={store.setViewMode}
    />
  )

  const rowIdInput = (
    <RowIdInput
      value={store.name.value}
      setValue={item.setRowName}
      readonly={!item.canUpdateRow}
      dataTestId="row-id-input"
    />
  )

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
        <EditRowDataCard
          isEdit={item.canUpdateRow}
          store={store}
          tableId={item.tableId}
          onSelectForeignKey={item.handleSelectForeignKey}
          onCreateAndConnectForeignKey={item.handleCreateAndConnectForeignKey}
          onUploadFile={item.uploadFileWithNotification}
        />
      </Flex>
    </Flex>
  )
})
