import { Box } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
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
  const { showSelectionColumn, sortModel } = context || {}

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
      >
        <Box height="30px" borderBottomWidth="1px" borderColor="gray.100"></Box>
      </Box>
      {columns.map((column) => (
        <ColumnHeader key={column.id} column={column} columnsModel={columnsModel} sortModel={sortModel} />
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
