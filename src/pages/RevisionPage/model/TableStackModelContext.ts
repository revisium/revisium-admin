import { createContext, useContext } from 'react'
import { RevisionPageModel } from 'src/pages/RevisionPage/model/RevisionPageModel.ts'
import { TableStackModel } from 'src/pages/RevisionPage/model/TableStackModel.ts'

export const TableStackModelContext = createContext<{
  root: RevisionPageModel
  item: TableStackModel
} | null>(null)

export const useTableStackModel = () => {
  const value = useContext(TableStackModelContext)

  if (!value) {
    throw new Error('Invalid TableStackModelContext')
  }

  return value
}
