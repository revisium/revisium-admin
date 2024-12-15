import { ArrayNodeStore } from 'src/features/SchemaEditor/model/ArrayNodeStore.ts'
import { BooleanNodeStore } from 'src/features/SchemaEditor/model/BooleanNodeStore.ts'
import { NumberNodeStore } from 'src/features/SchemaEditor/model/NumberNodeStore.ts'
import { ObjectNodeStore } from 'src/features/SchemaEditor/model/ObjectNodeStore.ts'
import { StringNodeStore } from 'src/features/SchemaEditor/model/StringNodeStore.ts'
import { StringReferenceNodeStore } from 'src/features/SchemaEditor/model/StringReferenceNodeStore.ts'

export enum NodeStoreType {
  Object = 'object',
  Array = 'array',
  String = 'string',
  StringReference = 'stringReference',
  Number = 'number',
  Boolean = 'boolean',
}

export type ParentSchemaNode = ObjectNodeStore | ArrayNodeStore

export type SchemaNode = ParentSchemaNode | StringNodeStore | NumberNodeStore | BooleanNodeStore

export type NodeStore = SchemaNode | StringReferenceNodeStore
