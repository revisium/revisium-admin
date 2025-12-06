import { createContext } from 'react'
import { ColumnsModel } from 'src/widgets/RowList/model/ColumnsModel'
import { RowItemViewModel } from 'src/widgets/RowList/model/RowItemViewModel'

export interface RowListContextValue {
  items: RowItemViewModel[]
  columnsModel: ColumnsModel
  isSelectMode: boolean
  onSelect?: (rowId: string) => void
  onCopy?: (rowVersionId: string) => void
}

export const RowListContext = createContext<RowListContextValue | null>(null)
