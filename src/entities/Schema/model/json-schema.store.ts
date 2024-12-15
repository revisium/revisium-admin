import { JsonArrayStore } from 'src/entities/Schema/model/json-array.store.ts'
import { JsonBooleanStore } from 'src/entities/Schema/model/json-boolean.store.ts'
import { JsonNumberStore } from 'src/entities/Schema/model/json-number.store.ts'
import { JsonObjectStore } from 'src/entities/Schema/model/json-object.store.ts'
import { JsonStringStore } from 'src/entities/Schema/model/json-string.store.ts'

export type JsonSchemaStorePrimitives = JsonStringStore | JsonNumberStore | JsonBooleanStore

export type JsonSchemaStore = JsonObjectStore | JsonArrayStore | JsonSchemaStorePrimitives
