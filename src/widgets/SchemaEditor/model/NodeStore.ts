import { ArrayNodeStore } from 'src/widgets/SchemaEditor/model/ArrayNodeStore.ts'
import { BooleanNodeStore } from 'src/widgets/SchemaEditor/model/BooleanNodeStore.ts'
import { NumberNodeStore } from 'src/widgets/SchemaEditor/model/NumberNodeStore.ts'
import { ObjectNodeStore } from 'src/widgets/SchemaEditor/model/ObjectNodeStore.ts'
import { StringNodeStore } from 'src/widgets/SchemaEditor/model/StringNodeStore.ts'
import { StringForeignKeyNodeStore } from 'src/widgets/SchemaEditor/model/StringForeignKeyNodeStore.ts'

export enum NodeStoreType {
  Object = 'object',
  Array = 'array',
  String = 'string',
  StringForeignKey = 'stringForeignKey',
  Number = 'number',
  Boolean = 'boolean',
}

export type ParentSchemaNode = ObjectNodeStore | ArrayNodeStore

export type SchemaNode = ParentSchemaNode | StringNodeStore | NumberNodeStore | BooleanNodeStore

export type NodeStore = SchemaNode | StringForeignKeyNodeStore
