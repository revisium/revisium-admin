import { Box, Flex, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { LuText } from 'react-icons/lu'
import { ColumnsModel } from 'src/widgets/RowList/model/ColumnsModel'
import { AddColumnButton } from 'src/widgets/RowList/ui/AddColumnButton/AddColumnButton'
import { ColumnHeader } from 'src/widgets/RowList/ui/ColumnHeader/ColumnHeader'
import { RowListContext, SELECTION_COLUMN_WIDTH } from './RowListContext'

interface HeaderContentProps {
  columnsModel: ColumnsModel
}

export const HeaderContent: React.FC<HeaderContentProps> = observer(({ columnsModel }) => {
  const columns = columnsModel.columns
  const context = useContext(RowListContext)
  const model = context?.model
  const showSelectionColumn = model?.showSelectionColumn ?? false
  const sortModel = model?.sortModel
  const filterModel = model?.filterModel

  return (
    <Box as="tr" height="40px">
      <Box
        as="th"
        backgroundColor="white"
        position="sticky"
        left={0}
        zIndex={1}
        width={showSelectionColumn ? SELECTION_COLUMN_WIDTH : '0px'}
        maxWidth={showSelectionColumn ? SELECTION_COLUMN_WIDTH : '0px'}
        minWidth={showSelectionColumn ? SELECTION_COLUMN_WIDTH : '0px'}
        overflow="hidden"
        transition="width 0.15s, min-width 0.15s, max-width 0.15s"
      >
        <Box height="30px" borderBottomWidth="1px" borderColor="gray.100" />
      </Box>
      <Box
        as="th"
        backgroundColor="white"
        position="sticky"
        left={showSelectionColumn ? SELECTION_COLUMN_WIDTH : 0}
        zIndex={1}
        width="200px"
        maxWidth="200px"
        minWidth="200px"
        transition="left 0.15s"
        textAlign="start"
      >
        <Flex
          alignItems="center"
          height="30px"
          borderBottomWidth="1px"
          borderColor="gray.100"
          pl="8px"
          pr="8px"
          gap="4px"
        >
          <Box as={LuText} fontSize="xs" color="gray.300" flexShrink={0} />
          <Text
            color="gray.400"
            fontSize="sm"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            overflow="hidden"
          >
            id
          </Text>
        </Flex>
      </Box>
      {columns.map((column) => (
        <ColumnHeader
          key={column.id}
          column={column}
          columnsModel={columnsModel}
          sortModel={sortModel}
          filterModel={filterModel}
        />
      ))}
      <AddColumnButton
        availableFields={columnsModel.availableFieldsToAdd}
        hasHiddenColumns={columnsModel.hasHiddenColumns}
        onAddColumn={columnsModel.addColumn}
        onAddAll={columnsModel.addAll}
      />
    </Box>
  )
})
