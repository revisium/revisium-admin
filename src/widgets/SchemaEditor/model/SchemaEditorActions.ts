import { createContext, useContext } from 'react'
import { RootNodeStore } from 'src/widgets/SchemaEditor/model/RootNodeStore.ts'
import { StringForeignKeyNodeStore } from 'src/widgets/SchemaEditor/model/StringForeignKeyNodeStore.ts'

export enum SchemaEditorMode {
  Creating = 'Creating',
  Updating = 'Updating',
  Reading = 'Reading',
}

export interface SchemaEditorActionsType {
  onSelectForeignKey: (node: StringForeignKeyNodeStore) => void
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
