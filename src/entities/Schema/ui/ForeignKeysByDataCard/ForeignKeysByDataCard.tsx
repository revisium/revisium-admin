import { Flex } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { ForeignKeysItem } from 'src/entities/Schema/ui/ForeignKeysByDataCard/ForeignKeysItem/ForeignKeysItem.tsx'
import { IRowModel } from 'src/shared/model/BackendStore'
import { IConnection } from 'src/shared/model/BackendStore/model-connection/createModelConnection.ts'

interface ForeignKeysByDataCardProps {
  row: IRowModel
}

export const ForeignKeysByDataCard: React.FC<ForeignKeysByDataCardProps> = ({ row }) => {
  const tables: { tableId: string; connection: IConnection<IRowModel> }[] = useMemo(() => {
    const tableIds = [...row.rowForeignKeysByConnection.keys()]

    return tableIds
      .map((tableId) => ({
        tableId,
        connection: row.rowForeignKeysByConnection.get(tableId) as IConnection<IRowModel>,
      }))
      .filter((item) => item.connection.totalCount)
  }, [row])

  return (
    <Flex flexDirection="column" width="100%" gap="40px">
      {tables.map(({ tableId, connection }) => (
        <ForeignKeysItem key={tableId} tableId={tableId} connection={connection} />
      ))}
    </Flex>
  )
}
