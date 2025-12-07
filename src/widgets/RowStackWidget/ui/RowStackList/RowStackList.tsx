import { Box, Flex, IconButton, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useRef } from 'react'
import { PiPlus } from 'react-icons/pi'
import { JsonSchema } from 'src/entities/Schema'
import { useViewModel } from 'src/shared/lib/hooks'
import { Tooltip } from 'src/shared/ui'
import { RowList, RowListViewModel, SearchInput } from 'src/widgets/RowList'
import { FilterPopover } from 'src/widgets/RowList/ui/FilterBar'
import { SortPopover } from 'src/widgets/RowList/ui/SortPopover'
import { RowStackModelStateType } from 'src/widgets/RowStackWidget/model/RowStackModel'
import { useRowStackModel } from 'src/widgets/RowStackWidget/model/RowStackModelContext'
import { RowStackHeader } from 'src/widgets/RowStackWidget/ui/RowStackHeader/RowStackHeader'
import { SelectingForeignKeyDivider } from 'src/widgets/RowStackWidget/ui/SelectingForeignKeyDivider/SelectingForeignKeyDivider'

export const RowStackList: React.FC = observer(() => {
  const { root, item } = useRowStackModel()
  const filterAnchorRef = useRef<HTMLDivElement>(null)

  const tableId = item.table.id
  const schema = item.schema as JsonSchema

  const model = useViewModel(RowListViewModel, tableId, schema)

  const isFirstLevel = root.stack.indexOf(item) === 0
  const showBreadcrumbs = isFirstLevel && !item.state.isSelectingForeignKey
  const isSelectMode = item.state.isSelectingForeignKey

  const handleSelectRow = useCallback(
    (rowId: string) => {
      root.onSelectedForeignKey(item, rowId)
    },
    [item, root],
  )

  if (item.state.type !== RowStackModelStateType.List) {
    return null
  }

  const createRowButton = model.canCreateRow ? (
    <Tooltip content="New row" openDelay={300}>
      <IconButton
        aria-label="New row"
        size="xs"
        variant="ghost"
        onClick={item.toCreatingRow}
        data-testid="create-row-button"
        color="gray.500"
        _hover={{ bg: 'gray.100' }}
      >
        <PiPlus />
      </IconButton>
    </Tooltip>
  ) : null

  const searchAndFilter = (
    <Flex alignItems="center" gap={2}>
      <SearchInput value={model.searchQuery} onChange={model.setSearchQuery} onClear={model.clearSearch} />
      {model.canFilter && <FilterPopover filterModel={model.filterModel} anchorRef={filterAnchorRef} />}
      {model.canSort && <SortPopover sortModel={model.sortModel} anchorRef={filterAnchorRef} />}
    </Flex>
  )

  return (
    <Flex flexDirection="column" flex={1}>
      {showBreadcrumbs && <RowStackHeader showBreadcrumbs actions={createRowButton} search={searchAndFilter} />}
      {isSelectMode && (
        <>
          <SelectingForeignKeyDivider tableId={item.table.id} />
          <RowStackHeader tableTitle={item.table.id} actions={createRowButton} search={searchAndFilter} />
        </>
      )}
      <Box ref={filterAnchorRef} paddingX="8px" />
      <Flex alignItems="center" paddingX="8px" paddingY="8px">
        <Text fontSize="sm" color="gray.500">
          {model.rowCountText}
        </Text>
      </Flex>
      <Box flex={1} paddingBottom="1rem">
        <RowList model={model} onSelect={isSelectMode ? handleSelectRow : undefined} onCopy={item.toCloneRow} />
      </Box>
    </Flex>
  )
})
