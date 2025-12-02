import { Box, Flex } from '@chakra-ui/react'
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

  const handleUpdateRow = useCallback(async () => {
    if (item.state.type !== RowStackModelStateType.UpdatingRow) return

    const store = item.state.store
    setIsLoading(true)

    try {
      const result = await item.updateRow(store)

      if (result) {
        store.save()
        store.syncReadOnlyStores()
        navigate(linkMaker.make({ revisionIdOrTag: DRAFT_TAG, rowId: store.name.getPlainValue() }))
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

  const handleUploadFile = useCallback(
    async (fileId: string, file: File) => {
      if (item.state.type !== RowStackModelStateType.UpdatingRow) return

      const store = item.state.store
      const toastId = nanoid()
      toaster.loading({ id: toastId, title: 'Uploading...' })

      try {
        const result = await item.uploadFile(store, fileId, file)

        if (result) {
          toaster.update(toastId, {
            type: 'info',
            title: 'Successfully uploaded!',
            duration: 1500,
          })
          store.syncReadOnlyStores()
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
      mode={store.viewMode || ViewerSwitcherMode.Tree}
      onChange={store.setViewMode}
    />
  )

  return (
    <Flex flexDirection="column" flex={1}>
      {item.state.isSelectingForeignKey && <SelectingForeignKeyDivider tableId={item.table.id} />}
      <RowStackHeader showBreadcrumbs={showBreadcrumbs} actions={actions} switcher={switcher} />
      <Box paddingTop="1rem">
        <EditRowDataCard
          isEdit={canUpdateRow}
          store={store}
          onSelectForeignKey={handleSelectForeignKey}
          onUploadFile={handleUploadFile}
        />
      </Box>
    </Flex>
  )
})
