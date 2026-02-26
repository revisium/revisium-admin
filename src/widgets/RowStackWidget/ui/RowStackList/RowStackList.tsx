import { Flex, IconButton, Skeleton, VStack } from '@chakra-ui/react'
import { TableEditor } from '@revisium/schema-toolkit-ui'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useMemo } from 'react'
import { PiPlus } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import { JsonObjectSchema, JsonSchemaTypeName } from 'src/entities/Schema'
import { RowListItem } from 'src/pages/RowPage/model/items'
import { useViewModel } from 'src/shared/lib/hooks'
import { Tooltip } from 'src/shared/ui'
import { TableEditorViewModel } from 'src/widgets/RowStackWidget/model/TableEditorViewModel.ts'
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
  const navigate = useNavigate()
  const tableId = item.tableId
  const schema = item.schema
  const isSelectMode = item.isSelectingForeignKey

  const handleOpenRow = useCallback(
    (rowId: string) => {
      navigate(rowId)
    },
    [navigate],
  )

  const callbacks = useMemo(
    () => ({
      onCreateRow: item.canCreateRow ? item.toCreating : undefined,
      onOpenRow: isSelectMode ? undefined : handleOpenRow,
      onPickRow: isSelectMode ? item.selectForeignKeyRow : undefined,
      onDuplicateRow: isSelectMode ? undefined : item.canCreateRow ? item.toCloning : undefined,
    }),
    [item, isSelectMode, handleOpenRow],
  )

  const model = useViewModel(TableEditorViewModel, tableId, (schema ?? EMPTY_SCHEMA) as JsonObjectSchema, callbacks)

  if (!schema || !model.core) {
    return <RowListSkeleton />
  }

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

  return (
    <Flex flexDirection="column" flex={1} minWidth={0}>
      {isSelectMode && (
        <>
          <SelectingForeignKeyDivider tableId={tableId} />
          <RowStackHeader tableTitle={tableId} actions={createRowButton} />
        </>
      )}
      <Flex flex={1} flexDirection="column" minWidth={0}>
        <TableEditor viewModel={model.core} useWindowScroll />
      </Flex>
    </Flex>
  )
})
