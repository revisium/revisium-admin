import { Box, Flex, IconButton, Skeleton, Spinner, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useRef } from 'react'
import { PiPlus } from 'react-icons/pi'
import { JsonObjectSchema, JsonSchemaTypeName } from 'src/entities/Schema'
import { RowListItem } from 'src/pages/RowPage/model/items'
import { useViewModel } from 'src/shared/lib/hooks'
import { Tooltip } from 'src/shared/ui'
import { RowList, RowListViewModel, SearchInput } from 'src/widgets/RowList'
import { FilterPopover } from 'src/widgets/RowList/ui/FilterBar'
import { SortPopover } from 'src/widgets/RowList/ui/SortPopover'
import { ViewSettingsBadge } from 'src/widgets/RowList/ui/ViewSettingsBadge'
import { RowStackHeader } from 'src/widgets/RowStackWidget/ui/RowStackHeader/RowStackHeader'
import { SelectingForeignKeyDivider } from 'src/widgets/RowStackWidget/ui/SelectingForeignKeyDivider/SelectingForeignKeyDivider'

interface Props {
  item: RowListItem
}

const RowListSkeleton: React.FC = () => (
  <Flex flexDirection="column" flex={1}>
    <VStack gap={2} align="stretch" marginTop="16px">
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} height="40px" />
      ))}
    </VStack>
  </Flex>
)

const EMPTY_SCHEMA: JsonObjectSchema = {
  type: JsonSchemaTypeName.Object,
  properties: {},
  additionalProperties: false,
  required: [],
}

export const RowStackList: React.FC<Props> = observer(({ item }) => {
  const filterAnchorRef = useRef<HTMLDivElement>(null)

  const tableId = item.tableId
  const schema = item.schema
  const revisionId = item.revisionId

  const model = useViewModel(RowListViewModel, tableId, schema ?? EMPTY_SCHEMA)

  if (!schema) {
    return <RowListSkeleton />
  }

  const isSelectMode = item.isSelectingForeignKey

  const handleSelectRow = useCallback(
    (rowId: string) => {
      item.selectForeignKeyRow(rowId)
    },
    [item],
  )

  const createRowButton = model.canCreateRow ? (
    <Tooltip content="New row" openDelay={300}>
      <IconButton
        aria-label="New row"
        size="xs"
        variant="ghost"
        onClick={item.toCreating}
        data-testid="create-row-button"
        color="gray.500"
        _hover={{ bg: 'gray.100' }}
      >
        <PiPlus />
      </IconButton>
    </Tooltip>
  ) : null

  const searchAndFilter = model.showEmpty ? null : (
    <Flex alignItems="center" gap={2}>
      <SearchInput value={model.searchQuery} onChange={model.setSearchQuery} onClear={model.clearSearch} />
      {model.canFilter && <FilterPopover filterModel={model.filterModel} anchorRef={filterAnchorRef} />}
      {model.canSort && <SortPopover sortModel={model.sortModel} anchorRef={filterAnchorRef} />}
    </Flex>
  )

  return (
    <Flex flexDirection="column" flex={1}>
      {item.showBreadcrumbs && <RowStackHeader showBreadcrumbs actions={createRowButton} search={searchAndFilter} />}
      {isSelectMode && (
        <>
          <SelectingForeignKeyDivider tableId={tableId} />
          <RowStackHeader tableTitle={tableId} actions={createRowButton} search={searchAndFilter} />
        </>
      )}
      <Box ref={filterAnchorRef} paddingX="8px" />
      <Box flex={1} position="relative" marginTop="16px">
        <RowList
          model={model}
          revisionId={revisionId}
          tableId={tableId}
          isRevisionReadonly={!item.isEditableRevision}
          onSelect={isSelectMode ? handleSelectRow : undefined}
          onCopy={item.toCloning}
          onCreate={model.canCreateRow ? item.toCreating : undefined}
        />
      </Box>
      {!model.showEmpty && !model.showLoading && (
        <Flex
          alignItems="center"
          justifyContent="space-between"
          paddingX="12px"
          paddingY="8px"
          marginTop="4px"
          borderTop="1px solid"
          borderColor="gray.100"
        >
          <Flex alignItems="center" gap="8px">
            <Text fontSize="sm" color="gray.500">
              {model.rowCountText}
            </Text>
            {model.isRefetching && <Spinner size="xs" color="gray.400" />}
          </Flex>
          <ViewSettingsBadge model={model.viewSettingsBadge} />
        </Flex>
      )}
    </Flex>
  )
})
