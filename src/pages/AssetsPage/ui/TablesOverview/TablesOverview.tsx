import { Box, HStack, Tag } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { TableWithFiles } from 'src/pages/AssetsPage/api/AssetsDataSource'

interface TablesOverviewProps {
  tables: TableWithFiles[]
  selectedTableId: string | null
  onSelectTable: (tableId: string | null) => void
}

export const TablesOverview: FC<TablesOverviewProps> = observer(({ tables, selectedTableId, onSelectTable }) => {
  if (tables.length === 0) {
    return null
  }

  return (
    <Box width="100%" overflowX="auto" paddingY={2}>
      <HStack gap={2} flexWrap="nowrap" minWidth="min-content">
        <Tag.Root
          size="lg"
          variant={selectedTableId === null ? 'solid' : 'outline'}
          cursor="pointer"
          onClick={() => onSelectTable(null)}
          flexShrink={0}
        >
          <Tag.Label>All</Tag.Label>
        </Tag.Root>

        {tables.map((table) => (
          <Tag.Root
            key={table.id}
            size="lg"
            variant={selectedTableId === table.id ? 'solid' : 'outline'}
            cursor="pointer"
            onClick={() => onSelectTable(table.id)}
            flexShrink={0}
          >
            <Tag.Label>{table.id}</Tag.Label>
          </Tag.Root>
        ))}
      </HStack>
    </Box>
  )
})
