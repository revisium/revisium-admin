import { Box } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { ColumnsModel } from 'src/widgets/RowList/model/ColumnsModel'
import { AddColumnButton } from 'src/widgets/RowList/ui/AddColumnButton/AddColumnButton'
import { ColumnHeader } from 'src/widgets/RowList/ui/ColumnHeader/ColumnHeader'

interface HeaderContentProps {
  columnsModel: ColumnsModel
}

export const HeaderContent: React.FC<HeaderContentProps> = observer(({ columnsModel }) => {
  const columns = columnsModel.columns

  return (
    <Box as="tr" height="40px">
      <Box
        as="th"
        backgroundColor="white"
        position="sticky"
        left={0}
        zIndex={1}
        width="200px"
        maxWidth="200px"
        minWidth="200px"
      >
        <Box height="30px" borderBottomWidth="1px" borderColor="gray.100"></Box>
      </Box>
      {columns.map((column) => (
        <ColumnHeader
          key={column.id}
          column={column}
          canRemove={columnsModel.canRemoveColumn}
          canHideAll={columnsModel.canHideAll}
          onRemove={() => columnsModel.removeColumn(column.id)}
          onHideAll={columnsModel.hideAll}
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
