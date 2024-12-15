import { createContext, useContext } from 'react'
import { RowStackModel } from 'src/widgets/RowStackWidget/model/RowStackModel.ts'
import { RowStackWidgetModel } from 'src/widgets/RowStackWidget/model/RowStackWidgetModel.ts'

export const RowStackModelContext = createContext<{
  root: RowStackWidgetModel
  item: RowStackModel
} | null>(null)

export const useRowStackModel = () => {
  const value = useContext(RowStackModelContext)

  if (!value) {
    throw new Error('Invalid RowStackModelContext')
  }

  return value
}
