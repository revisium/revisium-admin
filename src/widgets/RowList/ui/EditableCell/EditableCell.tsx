import { observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import { JsonObjectValueStore } from 'src/entities/Schema/model/value/json-object-value.store'
import { CellViewModel } from '../../model/CellViewModel'
import { BooleanCellEditor } from './BooleanCellEditor'
import { CellWrapper } from './CellWrapper'
import { FileCellDisplay } from './FileCellDisplay'
import { ForeignKeyCellEditor } from './ForeignKeyCellEditor'
import { ReadonlyCell } from './ReadonlyCell'
import { StringCellEditor } from './StringCellEditor'

interface EditableCellProps {
  cellVM: CellViewModel
  fieldName: string
  revisionId: string
  onNavigateToRow?: () => void
  onFileUpload?: (fileId: string, file: File, store: JsonObjectValueStore) => void
}

export const EditableCell: FC<EditableCellProps> = observer(
  ({ cellVM, fieldName, revisionId, onNavigateToRow, onFileUpload }) => {
    const handleFocus = useCallback(() => {
      cellVM.focus()
    }, [cellVM])

    const handleDoubleClick = useCallback(
      (clickOffset?: number, position?: { top: number; left: number; width: number; height: number }) => {
        cellVM.enterEditMode(clickOffset, position)
      },
      [cellVM],
    )

    const handleSave = useCallback(
      async (value: string | number | boolean) => {
        await cellVM.save(fieldName, value)
      },
      [cellVM, fieldName],
    )

    const handleCancel = useCallback(() => {
      cellVM.cancelEdit()
    }, [cellVM])

    const handleCommitAndMove = useCallback(
      (direction: 'down' | 'next' | 'prev') => {
        cellVM.commitAndMove(direction)
      },
      [cellVM],
    )

    const renderContent = () => {
      if (cellVM.fieldType === 'file' && cellVM.store instanceof JsonObjectValueStore) {
        return <FileCellDisplay store={cellVM.store} isReadonly={cellVM.isRevisionReadonly} onUpload={onFileUpload} />
      }

      if (cellVM.fieldType === 'object' || cellVM.fieldType === 'array') {
        return <ReadonlyCell value={cellVM.displayValue} type={cellVM.fieldType} onClick={onNavigateToRow} />
      }

      if (cellVM.isEditing) {
        if (cellVM.fieldType === 'foreignKey' && cellVM.foreignKey) {
          return (
            <ForeignKeyCellEditor
              value={cellVM.stringValue}
              revisionId={revisionId}
              foreignTableId={cellVM.foreignKey}
              rowId={cellVM.rowId}
              onSave={(v) => handleSave(v)}
              onCancel={handleCancel}
            />
          )
        }

        if (cellVM.fieldType === 'string') {
          return (
            <StringCellEditor
              value={cellVM.stringValue}
              onSave={(v) => handleSave(v)}
              onCancel={handleCancel}
              onCommitAndMove={cellVM.isReadonly ? undefined : handleCommitAndMove}
              clickOffset={cellVM.clickOffset}
              initialPosition={cellVM.cellPosition}
              readOnly={cellVM.isReadonly}
            />
          )
        }

        if (cellVM.fieldType === 'number') {
          return (
            <StringCellEditor
              value={cellVM.stringValue}
              defaultValue={cellVM.numberDefault}
              onSave={(v) => handleSave(v)}
              onCancel={handleCancel}
              onCommitAndMove={cellVM.isReadonly ? undefined : handleCommitAndMove}
              clickOffset={cellVM.clickOffset}
              initialPosition={cellVM.cellPosition}
              type="number"
              readOnly={cellVM.isReadonly}
            />
          )
        }

        if (cellVM.fieldType === 'boolean') {
          return <BooleanCellEditor value={cellVM.booleanValue} onSave={(v) => handleSave(v)} onCancel={handleCancel} />
        }
      }

      if (cellVM.isReadonly && !cellVM.supportsViewMode) {
        return <ReadonlyCell value={cellVM.displayValue} type="readonly" />
      }

      return cellVM.displayValue
    }

    return (
      <CellWrapper
        state={cellVM.cellState}
        displayValue={cellVM.displayValue}
        tooltip={cellVM.sizeTooltip}
        rowId={cellVM.rowId}
        fieldName={fieldName}
        onFocus={handleFocus}
        onDoubleClick={handleDoubleClick}
      >
        {renderContent()}
      </CellWrapper>
    )
  },
)
