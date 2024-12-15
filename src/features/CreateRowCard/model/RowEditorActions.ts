import { createContext, useContext } from 'react'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store.ts'

export enum RowEditorMode {
  Creating = 'Creating',
  Updating = 'Updating',
  Reading = 'Reading',
}

export interface RowEditorActionsType {
  onSelectReference: (node: JsonStringValueStore) => Promise<void>
  mode: RowEditorMode
  onOverNode: (node: JsonValueStore | null) => void
}

export const RowEditorActions = createContext<RowEditorActionsType | null>(null)

export const useRowEditorActions = () => {
  const value = useContext(RowEditorActions)

  if (!value) {
    throw new Error('Invalid RowEditorActions context')
  }

  return value
}
