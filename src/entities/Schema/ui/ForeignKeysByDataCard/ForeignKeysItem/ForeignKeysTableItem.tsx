import { Flex, Text } from '@chakra-ui/react'
import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Virtuoso } from 'react-virtuoso'
import { useLinkMaker } from 'src/entities/Navigation/hooks/useLinkMaker.ts'
import { ForeignKeyTableData } from 'src/entities/Schema/model/ForeignKeysByDataSource.ts'
import { RowListItem } from './RowListItem.tsx'

interface ForeignKeysTableItemProps {
  table: ForeignKeyTableData
}

export const ForeignKeysTableItem: React.FC<ForeignKeysTableItemProps> = ({ table }) => {
  const navigate = useNavigate()
  const linkMaker = useLinkMaker()

  const handleSelect = useCallback(
    (rowId: string) => {
      navigate(linkMaker.make({ ...linkMaker.getCurrentOptions(), tableId: table.tableId, rowId }), {
        state: { isBackToRow: true },
      })
    },
    [linkMaker, navigate, table.tableId],
  )

  return (
    <Flex flexDirection="column" width="100%">
      <Flex minHeight="40px" width="100%" gap="4px">
        <Text>{table.tableId}</Text>
        <Text color="gray.300">({table.totalCount})</Text>
      </Flex>
      <Virtuoso
        useWindowScroll
        totalCount={table.rows.length}
        defaultItemHeight={40}
        increaseViewportBy={40 * 100}
        itemContent={(index) => {
          const row = table.rows[index]

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
