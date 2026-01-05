import { Flex, Spinner, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { ForeignKeysByViewModel } from 'src/entities/Schema/model/ForeignKeysByViewModel.ts'
import { ForeignKeysTableItem } from 'src/entities/Schema/ui/ForeignKeysByDataCard/ForeignKeysItem/ForeignKeysTableItem.tsx'
import { useViewModel } from 'src/shared/lib/hooks/useViewModel.ts'

interface ForeignKeysByDataCardProps {
  tableId: string
  rowId: string
}

export const ForeignKeysByDataCard: React.FC<ForeignKeysByDataCardProps> = observer(({ tableId, rowId }) => {
  const model = useViewModel(ForeignKeysByViewModel, tableId, rowId)

  if (model.isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" py="40px">
        <Spinner />
      </Flex>
    )
  }

  if (model.error) {
    return (
      <Flex justifyContent="center" alignItems="center" py="40px">
        <Text color="red.500">{model.error}</Text>
      </Flex>
    )
  }

  if (!model.hasTables) {
    return (
      <Flex justifyContent="center" alignItems="center" py="40px">
        <Text color="gray.500">No foreign keys references found</Text>
      </Flex>
    )
  }

  return (
    <Flex flexDirection="column" width="100%" gap="40px">
      {model.tables.map((table) => (
        <ForeignKeysTableItem key={table.tableId} table={table} />
      ))}
    </Flex>
  )
})
