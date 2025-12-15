import { Box } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { useIdColumnResize } from 'src/widgets/RowList/hooks/useIdColumnResize'
import { ColumnsModel } from 'src/widgets/RowList/model/ColumnsModel'
import { AddColumnButton } from 'src/widgets/RowList/ui/AddColumnButton/AddColumnButton'
import { ColumnHeader } from 'src/widgets/RowList/ui/ColumnHeader/ColumnHeader'
import { IdColumnHeader } from 'src/widgets/RowList/ui/ColumnHeader/IdColumnHeader'
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
  const idColumnWidth = columnsModel.idColumnWidth
  const { isResizing, handleMouseDown } = useIdColumnResize(columnsModel)

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
      <IdColumnHeader
        width={idColumnWidth}
        left={showSelectionColumn ? SELECTION_COLUMN_WIDTH : 0}
        isResizing={isResizing}
        onResizeMouseDown={handleMouseDown}
        sortModel={sortModel}
        filterModel={filterModel}
      />
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
        availableSystemFields={columnsModel.availableSystemFieldsToAdd}
        hasHiddenColumns={columnsModel.hasHiddenColumns}
        onAddColumn={columnsModel.addColumn}
        onAddAll={columnsModel.addAll}
        getAvailableFileChildren={columnsModel.getAvailableFileChildren}
        isColumnVisible={columnsModel.isColumnVisible}
      />
    </Box>
  )
})
