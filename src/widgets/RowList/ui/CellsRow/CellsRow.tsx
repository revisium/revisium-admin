import { observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ColumnsModel } from 'src/widgets/RowList/model/ColumnsModel'
import { RowItemViewModel } from 'src/widgets/RowList/model/RowItemViewModel'
import { EditableCell } from 'src/widgets/RowList/ui/EditableCell'

interface CellsRowProps {
  row: RowItemViewModel
  columnsModel: ColumnsModel
  revisionId: string
  isRevisionReadonly?: boolean
  onFileUpload?: (fileId: string, file: File) => void
}

export const CellsRow: FC<CellsRowProps> = observer(({ row, columnsModel, revisionId, onFileUpload }) => {
  const navigate = useNavigate()

  const handleNavigateToRow = useCallback(() => {
    navigate(row.id)
  }, [navigate, row.id])

  return (
    <>
      {columnsModel.columns.map((column) => {
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
            isLastColumn={columnsModel.isLastColumn(column.id)}
            onNavigateToRow={handleNavigateToRow}
            onFileUpload={onFileUpload}
          />
        )
      })}
    </>
  )
})
