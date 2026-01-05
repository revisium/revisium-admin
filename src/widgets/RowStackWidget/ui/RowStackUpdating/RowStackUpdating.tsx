import { Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLinkMaker } from 'src/entities/Navigation/hooks/useLinkMaker.ts'
import { ViewerSwitcherMode } from 'src/entities/Schema'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'
import { RowViewerSwitcher } from 'src/entities/Schema/ui/RowViewerSwitcher/RowViewerSwitcher.tsx'
import { EditRowDataCard } from 'src/features/EditRowDataCard'
import { DRAFT_TAG } from 'src/shared/config/routes.ts'
import { container } from 'src/shared/lib'
import { PermissionContext } from 'src/shared/model/AbilityService'
import { ApproveButton, toaster } from 'src/shared/ui'
import { RevertButton } from 'src/shared/ui/RevertButton/RevertButton.tsx'

import { RowStackModelStateType } from 'src/widgets/RowStackWidget/model/RowStackModel.ts'
import { useRowStackModel } from 'src/widgets/RowStackWidget/model/RowStackModelContext.ts'
import { RowActionsMenu } from 'src/widgets/RowStackWidget/ui/RowActionsMenu/RowActionsMenu.tsx'
import { RowIdInput } from 'src/widgets/RowStackWidget/ui/RowIdInput/RowIdInput.tsx'
import { RowStackHeader } from 'src/widgets/RowStackWidget/ui/RowStackHeader/RowStackHeader.tsx'
import { SelectingForeignKeyDivider } from 'src/widgets/RowStackWidget/ui/SelectingForeignKeyDivider/SelectingForeignKeyDivider.tsx'

export const RowStackUpdating: React.FC = observer(() => {
  const navigate = useNavigate()
  const linkMaker = useLinkMaker()
  const permissionContext = container.get(PermissionContext)
  const { root, item } = useRowStackModel()

  const [isLoading, setIsLoading] = useState(false)

  const canUpdateRow = item.isEditableRevision && permissionContext.canUpdateRow

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
      if (item.state.type === RowStackModelStateType.UpdatingRow) {
        item.state.store.name.setValue(value)
      }
    },
    [item],
  )

  const handleUpdateRow = useCallback(async () => {
    if (item.state.type !== RowStackModelStateType.UpdatingRow) return

    const store = item.state.store
    setIsLoading(true)

    try {
      const result = await item.updateRow(store)

      if (result) {
        const newRowId = store.name.value
        store.save()
        store.syncReadOnlyStores()
        navigate(linkMaker.make({ revisionIdOrTag: DRAFT_TAG, rowId: newRowId }))
      }
    } catch {
      toaster.error({ title: 'Update failed' })
    } finally {
      setIsLoading(false)
    }
  }, [item, linkMaker, navigate])

  const handleRevert = useCallback(() => {
    if (item.state.type === RowStackModelStateType.UpdatingRow) {
      item.state.store.reset()
    }
  }, [item])

  const handleCopyJson = useCallback(async () => {
    if (item.state.type !== RowStackModelStateType.UpdatingRow) return

    const json = JSON.stringify(item.state.store.root.getPlainValue(), null, 2)
    await navigator.clipboard.writeText(json)
    toaster.info({ title: 'Copied to clipboard' })
  }, [item])

  const handleUploadFile = useCallback(
    async (fileId: string, file: File) => {
      if (item.state.type !== RowStackModelStateType.UpdatingRow) return

      const store = item.state.store
      const toastId = nanoid()
      toaster.loading({ id: toastId, title: 'Uploading...' })

      try {
        const freshData = await item.uploadFile(store, fileId, file)

        if (freshData) {
          toaster.update(toastId, {
            type: 'info',
            title: 'Successfully uploaded!',
            duration: 1500,
          })
          store.syncReadOnlyStores(freshData)
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
    [item, linkMaker, navigate],
  )

  if (item.state.type !== RowStackModelStateType.UpdatingRow) {
    return null
  }

  const store = item.state.store
  const effectiveViewMode = store.viewMode || ViewerSwitcherMode.Tree

  const actions = store.touched ? (
    <Flex gap="4px">
      <ApproveButton
        dataTestId="row-editor-approve-button"
        isDisabled={!store.isValid}
        loading={isLoading}
        onClick={handleUpdateRow}
      />
      <RevertButton dataTestId="row-editor-revert-button" onClick={handleRevert} />
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
      setValue={handleSetRowName}
      readonly={!canUpdateRow}
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
      {item.state.isSelectingForeignKey && <SelectingForeignKeyDivider tableId={item.table.id} />}
      <RowStackHeader
        showBreadcrumbs={showBreadcrumbs}
        rowIdInput={rowIdInput}
        actions={actions}
        actionsMenu={actionsMenu}
        switcher={switcher}
      />
      <Flex flexDirection="column" paddingTop="60px">
        <EditRowDataCard
          isEdit={canUpdateRow}
          store={store}
          tableId={item.table.id}
          onSelectForeignKey={handleSelectForeignKey}
          onUploadFile={handleUploadFile}
        />
      </Flex>
    </Flex>
  )
})
