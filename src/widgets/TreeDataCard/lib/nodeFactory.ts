import { JsonSchemaTypeName } from 'src/entities/Schema'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store'
import { ArrayValueNode } from 'src/widgets/TreeDataCard/model/ArrayValueNode.ts'
import { BaseValueNode } from 'src/widgets/TreeDataCard/model/BaseValueNode.ts'
import { BooleanValueNode } from 'src/widgets/TreeDataCard/model/BooleanValueNode.ts'
import { ForeignKeyValueNode } from 'src/widgets/TreeDataCard/model/ForeignKeyValueNode.ts'
import { NumberValueNode } from 'src/widgets/TreeDataCard/model/NumberValueNode.ts'
import { ObjectValueNode } from 'src/widgets/TreeDataCard/model/ObjectValueNode.ts'
import { StringValueNode } from 'src/widgets/TreeDataCard/model/StringValueNode.ts'

export function createNodeForStore(fieldName: string, store: JsonValueStore): BaseValueNode {
  switch (store.type) {
    case JsonSchemaTypeName.Object:
      return new ObjectValueNode(fieldName, store)

    case JsonSchemaTypeName.Array:
      return new ArrayValueNode(fieldName, store)

    case JsonSchemaTypeName.String: {
      const stringStore = store as JsonStringValueStore
      if (stringStore.foreignKey) {
        return new ForeignKeyValueNode(fieldName, stringStore)
      }
      return new StringValueNode(fieldName, stringStore)
    }

    case JsonSchemaTypeName.Number:
      return new NumberValueNode(fieldName, store)

    case JsonSchemaTypeName.Boolean:
      return new BooleanValueNode(fieldName, store)

    default:
      return new StringValueNode(fieldName, store)
  }
}
