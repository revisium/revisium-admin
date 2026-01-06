import { createContext, useContext } from 'react'

export interface StackContextValue<TItem> {
  item: TItem
}

export function createStackContext<TItem>() {
  const Context = createContext<StackContextValue<TItem> | null>(null)

  const useStackModel = (): StackContextValue<TItem> => {
    const ctx = useContext(Context)
    if (!ctx) {
      throw new Error('Stack context not found')
    }
    return ctx
  }

  return { Context, useStackModel }
}
