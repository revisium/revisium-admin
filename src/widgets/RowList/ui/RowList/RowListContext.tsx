import { createContext } from 'react'
import { ColumnsModel } from 'src/widgets/RowList/model/ColumnsModel'
import { RowItemViewModel } from 'src/widgets/RowList/model/RowItemViewModel'
import { SelectionViewModel } from 'src/widgets/RowList/model/SelectionViewModel'
import { SortModel } from 'src/widgets/RowList/model/SortModel'

export const SELECTION_COLUMN_WIDTH = '40px'

export interface RowListContextValue {
  items: RowItemViewModel[]
  columnsModel: ColumnsModel
  sortModel: SortModel
  isRowPickerMode: boolean
  onSelect?: (rowId: string) => void
  onCopy?: (rowVersionId: string) => void
  selection?: SelectionViewModel
  showSelectionColumn: boolean
}

export const RowListContext = createContext<RowListContextValue | null>(null)
