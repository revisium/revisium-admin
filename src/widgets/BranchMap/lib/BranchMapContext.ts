import { createContext, RefObject, useContext } from 'react'

export type BranchMapContextValue = {
  containerRef: RefObject<HTMLDivElement | null>
}

export const BranchMapContext = createContext<BranchMapContextValue | null>(null)

export const useBranchMapContext = (): BranchMapContextValue => {
  const context = useContext(BranchMapContext)
  if (!context) {
    throw new Error('useBranchMapContext must be used within BranchMapContext.Provider')
  }
  return context
}
