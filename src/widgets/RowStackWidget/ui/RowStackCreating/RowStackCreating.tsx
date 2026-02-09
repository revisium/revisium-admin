import { Flex } from '@chakra-ui/react'
import { RowEditor } from '@revisium/schema-toolkit-ui'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { ViewerSwitcherMode } from 'src/entities/Schema'
import { RowViewerSwitcher } from 'src/entities/Schema/ui/RowViewerSwitcher/RowViewerSwitcher.tsx'
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
  const state = item.state
  const effectiveViewMode = state.viewMode

  const actions = (
    <Flex gap="4px">
      <CloseButton dataTestId="close-create-row-button" onClick={item.toList} />
      <ApproveButton
        dataTestId="approve-create-row-button"
        loading={item.isLoading}
        onClick={item.approveAndNavigate}
        isDisabled={!state.isValid}
      />
    </Flex>
  )

  const switcher = (
    <RowViewerSwitcher availableRefByMode={false} mode={effectiveViewMode} onChange={state.setViewMode} />
  )

  const rowIdInput = <RowIdInput value={state.rowId} setValue={item.setRowName} dataTestId="row-id-input" />

  const isTreeMode = effectiveViewMode === ViewerSwitcherMode.Tree

  const actionsMenu = isTreeMode ? <RowActionsMenu onCopyJson={item.copyJsonToClipboard} /> : null

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
        {isTreeMode && <RowEditor viewModel={state.editor} />}
      </Flex>
    </Flex>
  )
})
