import { createContext, useContext } from 'react'

export interface StackContextValue<TManager, TItem> {
  root: TManager
  item: TItem
}

export function createStackContext<TManager, TItem>() {
  const Context = createContext<StackContextValue<TManager, TItem> | null>(null)

  const useStackModel = (): StackContextValue<TManager, TItem> => {
    const ctx = useContext(Context)
    if (!ctx) {
      throw new Error('Stack context not found')
    }
    return ctx
  }

  return { Context, useStackModel }
}
