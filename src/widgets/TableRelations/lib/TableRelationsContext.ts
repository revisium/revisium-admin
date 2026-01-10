import { createContext, RefObject, useContext } from 'react'

interface TableRelationsContextValue {
  containerRef: RefObject<HTMLElement | null>
}

export const TableRelationsContext = createContext<TableRelationsContextValue | null>(null)

export const useTableRelationsContext = (): TableRelationsContextValue => {
  const context = useContext(TableRelationsContext)
  if (!context) {
    throw new Error('useTableRelationsContext must be used within TableRelationsContext.Provider')
  }
  return context
}
