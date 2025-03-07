import { Flex, Text } from '@chakra-ui/react'
import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Virtuoso } from 'react-virtuoso'
import { useLinkMaker } from 'src/entities/Navigation/hooks/useLinkMaker.ts'
import { IRowModel } from 'src/shared/model/BackendStore'
import { IConnection } from 'src/shared/model/BackendStore/model-connection/createModelConnection.ts'
import { RowListItem } from './RowListItem.tsx'

interface ForeignKeysItemProps {
  tableId: string
  connection: IConnection<IRowModel>
}

// TODO create model

export const ForeignKeysItem: React.FC<ForeignKeysItemProps> = ({ tableId, connection }) => {
  const navigate = useNavigate()
  const linkMaker = useLinkMaker()

  const handleSelect = useCallback(
    (rowId: string) => {
      navigate(linkMaker.make({ ...linkMaker.getCurrentOptions(), tableId, rowId }), { state: { isBackToRow: true } })
    },
    [linkMaker, navigate, tableId],
  )

  return (
    <Flex flexDirection="column" width="100%">
      <Flex minHeight="40px" width="100%" gap="4px">
        <Text>{tableId}</Text>
        <Text color="gray.300">({connection.totalCount})</Text>
      </Flex>
      <Virtuoso
        useWindowScroll
        totalCount={connection.totalCount}
        defaultItemHeight={40}
        increaseViewportBy={40 * 100}
        itemContent={(index) => {
          const { node: row } = connection.edges[index]

          if (!row) {
            return undefined
          }

          return (
            <RowListItem
              row={{
                id: row.id,
                versionId: row.versionId,
                data: JSON.stringify(row.data, null, 2).replaceAll('\\n', ''),
              }}
              onSelect={handleSelect}
            />
          )
        }}
      />
    </Flex>
  )
}
