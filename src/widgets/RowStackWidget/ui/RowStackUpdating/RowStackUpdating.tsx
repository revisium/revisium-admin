import { Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLinkMaker } from 'src/entities/Navigation/hooks/useLinkMaker.ts'
import { ViewerSwitcherMode } from 'src/entities/Schema'
import { RowViewerSwitcher } from 'src/entities/Schema/ui/RowViewerSwitcher/RowViewerSwitcher.tsx'
import { EditRowDataCard } from 'src/features/EditRowDataCard'
import { RowUpdatingItem } from 'src/pages/RowPage/model/items'
import { DRAFT_TAG } from 'src/shared/config/routes.ts'
import { ApproveButton, toaster } from 'src/shared/ui'
import { RevertButton } from 'src/shared/ui/RevertButton/RevertButton.tsx'
import { RowActionsMenu } from 'src/widgets/RowStackWidget/ui/RowActionsMenu/RowActionsMenu.tsx'
import { RowIdInput } from 'src/widgets/RowStackWidget/ui/RowIdInput/RowIdInput.tsx'
import { RowStackHeader } from 'src/widgets/RowStackWidget/ui/RowStackHeader/RowStackHeader.tsx'
import { SelectingForeignKeyDivider } from 'src/widgets/RowStackWidget/ui/SelectingForeignKeyDivider/SelectingForeignKeyDivider.tsx'

interface Props {
  item: RowUpdatingItem
}

export const RowStackUpdating: React.FC<Props> = observer(({ item }) => {
  const navigate = useNavigate()
  const linkMaker = useLinkMaker()

  const store = item.store
  const effectiveViewMode = store.viewMode || ViewerSwitcherMode.Tree

  const handleUpdateRow = useCallback(async () => {
    try {
      const result = await item.approve()

      if (result) {
        const newRowId = store.name.value
        navigate(linkMaker.make({ revisionIdOrTag: DRAFT_TAG, rowId: newRowId }))
      }
    } catch {
      toaster.error({ title: 'Update failed' })
    }
  }, [item, linkMaker, navigate, store.name.value])

  const handleCopyJson = useCallback(async () => {
    const json = item.getJsonString()
    await navigator.clipboard.writeText(json)
    toaster.info({ title: 'Copied to clipboard' })
  }, [item])

  const handleUploadFile = useCallback(
    async (fileId: string, file: File) => {
      const toastId = nanoid()
      toaster.loading({ id: toastId, title: 'Uploading...' })

      try {
        const freshData = await item.uploadFile(fileId, file)

        if (freshData) {
          toaster.update(toastId, {
            type: 'info',
            title: 'Successfully uploaded!',
            duration: 1500,
          })
          item.syncReadOnlyStores(freshData)
          navigate(linkMaker.make({ revisionIdOrTag: DRAFT_TAG, rowId: store.name.getPlainValue() }))
        } else {
          toaster.update(toastId, {
            type: 'error',
            title: 'Upload failed',
            duration: 3000,
          })
        }
      } catch {
        toaster.update(toastId, {
          type: 'error',
          title: 'Upload failed',
          duration: 3000,
        })
      }
    },
    [item, linkMaker, navigate, store.name],
  )

  const actions = store.touched ? (
    <Flex gap="4px">
      <ApproveButton
        dataTestId="row-editor-approve-button"
        isDisabled={!store.isValid}
        loading={item.isLoading}
        onClick={handleUpdateRow}
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
        <EditRowDataCard
          isEdit={item.canUpdateRow}
          store={store}
          tableId={item.tableId}
          onSelectForeignKey={item.handleSelectForeignKey}
          onCreateAndConnectForeignKey={item.handleCreateAndConnectForeignKey}
          onUploadFile={handleUploadFile}
        />
      </Flex>
    </Flex>
  )
})
