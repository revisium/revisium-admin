import { Box, Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { CreateRowButton } from 'src/features/CreateRowButton'
import { container } from 'src/shared/lib'
import { PermissionContext } from 'src/shared/model/AbilityService'
import { useProjectPageModel } from 'src/shared/model/ProjectPageModel/hooks/useProjectPageModel.ts'
import { RowList } from 'src/widgets/RowList'

import { RowStackModelStateType } from 'src/widgets/RowStackWidget/model/RowStackModel.ts'
import { useRowStackModel } from 'src/widgets/RowStackWidget/model/RowStackModelContext.ts'
import { RowStackHeader } from 'src/widgets/RowStackWidget/ui/RowStackHeader/RowStackHeader.tsx'
import { SelectingForeignKeyDivider } from 'src/widgets/RowStackWidget/ui/SelectingForeignKeyDivider/SelectingForeignKeyDivider.tsx'

export const RowStackList: React.FC = observer(() => {
  const projectPageModel = useProjectPageModel()
  const permissionContext = container.get(PermissionContext)
  const { root, item } = useRowStackModel()

  const canCreateRow = projectPageModel.isEditableRevision && permissionContext.canCreateRow

  const isFirstLevel = root.stack.indexOf(item) === 0
  const showBreadcrumbs = isFirstLevel && !item.state.isSelectingForeignKey

  const handleSelectRow = useCallback(
    (rowId: string) => {
      root.onSelectedForeignKey(item, rowId)
    },
    [item, root],
  )

  if (item.state.type !== RowStackModelStateType.List) {
    return null
  }

  return (
    <Flex flexDirection="column" flex={1}>
      {showBreadcrumbs && <RowStackHeader showBreadcrumbs />}
      {item.state.isSelectingForeignKey && <SelectingForeignKeyDivider tableId={item.table.id} />}
      <Box paddingTop="1rem">
        {canCreateRow && <CreateRowButton onClick={item.toCreatingRow} />}
      </Box>
      <Box paddingTop="0.5rem" paddingBottom="1rem" flex={1}>
        <RowList
          table={item.table}
          onSelect={item.state.isSelectingForeignKey ? handleSelectRow : undefined}
          onCopy={item.toCloneRow}
        />
      </Box>
    </Flex>
  )
})
