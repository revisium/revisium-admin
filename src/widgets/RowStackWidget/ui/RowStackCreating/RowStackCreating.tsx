import { Flex } from '@chakra-ui/react'
import { RowEditor } from '@revisium/schema-toolkit-ui'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { ViewerSwitcherMode } from 'src/entities/Schema'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { RowViewerSwitcher } from 'src/entities/Schema/ui/RowViewerSwitcher/RowViewerSwitcher.tsx'
import { RowCreatingItem } from 'src/pages/RowPage/model/items'
import { ApproveButton, CloseButton } from 'src/shared/ui'
import { JsonCard } from 'src/shared/ui/JsonCard/JsonCard.tsx'
import { RowActionsMenu } from 'src/widgets/RowStackWidget/ui/RowActionsMenu/RowActionsMenu.tsx'
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

  const isTreeMode = effectiveViewMode === ViewerSwitcherMode.Tree

  const actionsMenu = isTreeMode ? <RowActionsMenu onCopyJson={item.copyJsonToClipboard} /> : null

  return (
    <Flex flexDirection="column" flex={1}>
      {item.isSelectingForeignKey && <SelectingForeignKeyDivider tableId={item.tableId} />}
      <RowStackHeader
        showBreadcrumbs={item.showBreadcrumbs}
        rowIdEditable={
          item.showBreadcrumbs
            ? {
                value: state.rowId,
                onChange: item.setRowName,
                placeholder: 'row id',
                dataTestId: 'row-id-input',
              }
            : undefined
        }
        actions={actions}
        actionsMenu={actionsMenu}
        switcher={switcher}
      />
      <Flex flexDirection="column">
        {isTreeMode && <RowEditor viewModel={state.editor} />}
        {effectiveViewMode === ViewerSwitcherMode.Json && (
          <JsonCard data={state.editor.getValue() as JsonValue} onChange={state.setJsonValue} />
        )}
      </Flex>
    </Flex>
  )
})
