import { Box, HStack, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { TableWithFiles } from 'src/pages/AssetsPage/api/AssetsDataSource'

interface TablesOverviewProps {
  tables: TableWithFiles[]
  selectedTableId: string | null
  onSelectTable: (tableId: string | null) => void
}

interface TableTabProps {
  label: string
  isSelected: boolean
  onClick: () => void
}

const TableTab: FC<TableTabProps> = ({ label, isSelected, onClick }) => (
  <Text
    fontSize="sm"
    color={isSelected ? 'newGray.600' : 'newGray.400'}
    fontWeight="500"
    cursor="pointer"
    onClick={onClick}
    flexShrink={0}
    _hover={{ color: 'newGray.500' }}
    borderBottom={isSelected ? '2px solid' : '2px solid transparent'}
    borderColor={isSelected ? 'newGray.400' : 'transparent'}
    pb={1}
  >
    {label}
  </Text>
)

export const TablesOverview: FC<TablesOverviewProps> = observer(({ tables, selectedTableId, onSelectTable }) => {
  if (tables.length === 0) {
    return null
  }

  return (
    <Box width="100%" overflowX="auto" paddingY={1}>
      <HStack gap={4} flexWrap="nowrap" minWidth="min-content">
        <TableTab label="All" isSelected={selectedTableId === null} onClick={() => onSelectTable(null)} />

        {tables.map((table) => (
          <TableTab
            key={table.id}
            label={table.id}
            isSelected={selectedTableId === table.id}
            onClick={() => onSelectTable(table.id)}
          />
        ))}
      </HStack>
    </Box>
  )
})
