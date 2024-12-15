import { createContext, useContext } from 'react'
import { RootNodeStore } from 'src/features/SchemaEditor/model/RootNodeStore.ts'
import { StringReferenceNodeStore } from 'src/features/SchemaEditor/model/StringReferenceNodeStore.ts'

export enum SchemaEditorMode {
  Creating = 'Creating',
  Updating = 'Updating',
  Reading = 'Reading',
}

export interface SchemaEditorActionsType {
  onSelectReference: (node: StringReferenceNodeStore) => void
  mode: SchemaEditorMode
  root: RootNodeStore
}

export const SchemaEditorActions = createContext<SchemaEditorActionsType | null>(null)

export const useSchemaEditor = () => {
  const value = useContext(SchemaEditorActions)

  if (!value) {
    throw new Error('Invalid SchemaEditorActions context')
  }

  return value
}
