import { Flex } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { RefsItem } from 'src/entities/Schema/ui/RefsByDataCard/RefsItem/RefsItem.tsx'
import { IRowModel } from 'src/shared/model/BackendStore'
import { IConnection } from 'src/shared/model/BackendStore/model-connection/createModelConnection.ts'

interface RefsByDataCardProps {
  row: IRowModel
}

export const RefsByDataCard: React.FC<RefsByDataCardProps> = ({ row }) => {
  const tables: { tableId: string; connection: IConnection<IRowModel> }[] = useMemo(() => {
    const tableIds = [...row.rowReferencesByConnection.keys()]

    return tableIds
      .map((tableId) => ({
        tableId,
        connection: row.rowReferencesByConnection.get(tableId) as IConnection<IRowModel>,
      }))
      .filter((item) => item.connection.totalCount)
  }, [row])

  return (
    <Flex flexDirection="column" width="100%" gap="40px">
      {tables.map(({ tableId, connection }) => (
        <RefsItem key={tableId} tableId={tableId} connection={connection} />
      ))}
    </Flex>
  )
}
