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
      const {
        fieldType,
        isReadonly,
        isEditing,
        supportsViewMode,
        displayValue,
        foreignKey,
        stringValue,
        numberDefault,
        booleanValue,
        store,
        clickOffset,
        cellPosition,
      } = cellVM

      if (fieldType === 'file' && store instanceof JsonObjectValueStore) {
        return <FileCellDisplay store={store} isReadonly={cellVM.isRevisionReadonly} onUpload={onFileUpload} />
      }

      if (fieldType === 'object' || fieldType === 'array') {
        return <ReadonlyCell value={displayValue} type={fieldType} onClick={onNavigateToRow} />
      }

      if (isEditing) {
        if (fieldType === 'foreignKey' && foreignKey) {
          return (
            <ForeignKeyCellEditor
              value={stringValue}
              revisionId={revisionId}
              foreignTableId={foreignKey}
              rowId={cellVM.rowId}
              onSave={(v) => handleSave(v)}
              onCancel={handleCancel}
            />
          )
        }

        if (fieldType === 'string') {
          return (
            <StringCellEditor
              value={stringValue}
              onSave={(v) => handleSave(v)}
              onCancel={handleCancel}
              onCommitAndMove={isReadonly ? undefined : handleCommitAndMove}
              clickOffset={clickOffset}
              initialPosition={cellPosition}
              readOnly={isReadonly}
            />
          )
        }

        if (fieldType === 'number') {
          return (
            <StringCellEditor
              value={stringValue}
              defaultValue={numberDefault}
              onSave={(v) => handleSave(v)}
              onCancel={handleCancel}
              onCommitAndMove={isReadonly ? undefined : handleCommitAndMove}
              clickOffset={clickOffset}
              initialPosition={cellPosition}
              type="number"
              readOnly={isReadonly}
            />
          )
        }

        if (fieldType === 'boolean') {
          return <BooleanCellEditor value={booleanValue} onSave={(v) => handleSave(v)} onCancel={handleCancel} />
        }
      }

      if (isReadonly && !supportsViewMode) {
        return <ReadonlyCell value={displayValue} type="readonly" />
      }

      return displayValue
    }

    return (
      <CellWrapper
        state={cellVM.cellState}
        displayValue={cellVM.displayValue}
        onFocus={handleFocus}
        onDoubleClick={handleDoubleClick}
      >
        {renderContent()}
      </CellWrapper>
    )
  },
)
