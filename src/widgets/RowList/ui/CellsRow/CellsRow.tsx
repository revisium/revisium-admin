import { observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { type ObjectValueNodeInterface as ObjectValueNode } from '@revisium/schema-toolkit-ui'
import { ColumnsModel } from 'src/widgets/RowList/model/ColumnsModel'
import { RowItemViewModel } from 'src/widgets/RowList/model/RowItemViewModel'
import { EditableCell } from 'src/widgets/RowList/ui/EditableCell'
import { SystemFieldCell } from 'src/widgets/RowList/ui/EditableCell/SystemFieldCell'

interface CellsRowProps {
  row: RowItemViewModel
  columnsModel: ColumnsModel
  revisionId: string
  onFileUpload?: (fileId: string, file: File, node: ObjectValueNode) => void
}

export const CellsRow: FC<CellsRowProps> = observer(({ row, columnsModel, revisionId, onFileUpload }) => {
  const navigate = useNavigate()

  const handleNavigateToRow = useCallback(() => {
    navigate(row.id)
  }, [navigate, row.id])

  return (
    <>
      {columnsModel.columns.map((column) => {
        if (column.isSystemColumn && column.systemFieldId) {
          const value = row.getSystemFieldValue(column.systemFieldId)
          return (
            <SystemFieldCell
              key={column.id}
              value={value}
              fieldType={column.fieldType}
              rowId={row.id}
              fieldName={column.name}
            />
          )
        }

        const cellVM = row.getCellViewModel(column.id)
        if (!cellVM) {
          return null
        }
        return (
          <EditableCell
            key={column.id}
            cellVM={cellVM}
            fieldName={column.name}
            revisionId={revisionId}
            onNavigateToRow={handleNavigateToRow}
            onFileUpload={onFileUpload}
          />
        )
      })}
    </>
  )
})
