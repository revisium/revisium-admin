import { createContext } from 'react'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { RowListViewModel } from 'src/widgets/RowList/model/RowListViewModel'

export const SELECTION_COLUMN_WIDTH = '40px'

export interface RowListContextValue {
  model: RowListViewModel
  revisionId: string
  tableId: string
  isRevisionReadonly: boolean
  isRowPickerMode: boolean
  onSelect?: (rowId: string) => void
  onCopy?: (rowData: JsonValue) => void
}

export const RowListContext = createContext<RowListContextValue | null>(null)
