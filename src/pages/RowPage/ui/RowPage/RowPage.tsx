import { Flex, Spinner, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useRowId } from 'src/entities/Project/hooks/useRowId.ts'
import { useTableId } from 'src/entities/Project/hooks/useTableId.ts'
import { UnsupportedSchemaForRow } from 'src/features/UnsupportedSchemaForRow/ui/UnsupportedSchemaForRow/UnsupportedSchemaForRow.tsx'
import { RowPageViewModel } from 'src/pages/RowPage/model/RowPageViewModel.ts'
import { useViewModel } from 'src/shared/lib/hooks/useViewModel.ts'
import { RowStackWidget } from 'src/widgets/RowStackWidget/ui/RowStackWidget/RowStackWidget.tsx'

export const RowPage: React.FC = observer(() => {
  const tableId = useTableId()
  const rowId = useRowId()

  const model = useViewModel(RowPageViewModel, tableId, rowId)

  if (model.error) {
    return (
      <Flex flex={1} justifyContent="center" alignItems="center">
        <Text color="red.500">{model.error}</Text>
      </Flex>
    )
  }

  if (model.isLoading || !model.hasData) {
    return (
      <Flex flex={1} justifyContent="center" alignItems="center">
        <Spinner />
      </Flex>
    )
  }

  if (!model.isValidSchema) {
    return <UnsupportedSchemaForRow data={model.row!.data} />
  }

  return (
    <RowStackWidget row={model.row!} table={model.table!} foreignKeysCount={model.foreignKeysCount} startWithUpdating />
  )
})
