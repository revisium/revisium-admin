import { Flex } from '@chakra-ui/react'
import { RowEditor } from '@revisium/schema-toolkit-ui'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { ViewerSwitcherMode } from 'src/entities/Schema'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { ForeignKeysByDataCard } from 'src/entities/Schema/ui/ForeignKeysByDataCard/ForeignKeysByDataCard.tsx'
import { RowViewerSwitcher } from 'src/entities/Schema/ui/RowViewerSwitcher/RowViewerSwitcher.tsx'
import { RowUpdatingItem } from 'src/pages/RowPage/model/items'
import { ApproveButton } from 'src/shared/ui'
import { JsonCard } from 'src/shared/ui/JsonCard/JsonCard.tsx'
import { RevertButton } from 'src/shared/ui/RevertButton/RevertButton.tsx'
import { RowActionsMenu } from 'src/widgets/RowStackWidget/ui/RowActionsMenu/RowActionsMenu.tsx'
import { RowStackHeader } from 'src/widgets/RowStackWidget/ui/RowStackHeader/RowStackHeader.tsx'
import { SelectingForeignKeyDivider } from 'src/widgets/RowStackWidget/ui/SelectingForeignKeyDivider/SelectingForeignKeyDivider.tsx'

interface Props {
  item: RowUpdatingItem
}

export const RowStackUpdating: React.FC<Props> = observer(({ item }) => {
  const state = item.state
  const effectiveViewMode = state.viewMode

  const actions = state.hasChanges ? (
    <Flex gap="4px">
      <ApproveButton
        dataTestId="row-editor-approve-button"
        isDisabled={!state.isValid}
        loading={item.isLoading}
        onClick={item.approveAndNavigate}
      />
      <RevertButton dataTestId="row-editor-revert-button" onClick={item.revert} />
    </Flex>
  ) : null

  const switcher = (
    <RowViewerSwitcher
      availableRefByMode={state.areThereForeignKeysBy}
      mode={effectiveViewMode}
      onChange={state.setViewMode}
    />
  )

  const isTreeMode = effectiveViewMode === ViewerSwitcherMode.Tree

  const actionsMenu = isTreeMode ? <RowActionsMenu onCopyJson={item.copyJsonToClipboard} /> : null

  return (
    <Flex flexDirection="column" flex={1}>
      {item.isSelectingForeignKey && <SelectingForeignKeyDivider tableId={item.tableId} />}
      <RowStackHeader
        showBreadcrumbs={item.showBreadcrumbs}
        rowIdEditable={item.showBreadcrumbs && item.canUpdateRow ? {
          value: state.rowId,
          onChange: item.setRowName,
          tooltip: 'Rename row',
          dataTestId: 'row-id-input',
        } : undefined}
        rowIdReadonly={item.showBreadcrumbs && !item.canUpdateRow ? state.rowId : undefined}
        actions={actions}
        actionsMenu={actionsMenu}
        switcher={switcher}
      />
      <Flex flexDirection="column">
        {effectiveViewMode === ViewerSwitcherMode.Tree && <RowEditor viewModel={state.editor} />}
        {effectiveViewMode === ViewerSwitcherMode.Json && (
          <JsonCard
            data={state.editor.getValue() as JsonValue}
            readonly={!item.canUpdateRow}
            onChange={state.setJsonValue}
          />
        )}
        {effectiveViewMode === ViewerSwitcherMode.RefBy && (
          <ForeignKeysByDataCard tableId={item.tableId} rowId={item.currentRowId} />
        )}
      </Flex>
    </Flex>
  )
})
