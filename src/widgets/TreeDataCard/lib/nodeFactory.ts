import { JsonSchemaTypeName } from 'src/entities/Schema'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store'
import { ArrayValueNode } from 'src/widgets/TreeDataCard/model/ArrayValueNode.ts'
import { BaseValueNode } from 'src/widgets/TreeDataCard/model/BaseValueNode.ts'
import { BooleanValueNode } from 'src/widgets/TreeDataCard/model/BooleanValueNode.ts'
import { ForeignKeyValueNode } from 'src/widgets/TreeDataCard/model/ForeignKeyValueNode.ts'
import { NumberValueNode } from 'src/widgets/TreeDataCard/model/NumberValueNode.ts'
import { ObjectValueNode } from 'src/widgets/TreeDataCard/model/ObjectValueNode.ts'
import { MarkdownParentValueNode } from 'src/widgets/TreeDataCard/model/MarkdownParentValueNode.ts'
import { StringParentValueNode } from 'src/widgets/TreeDataCard/model/StringParentValueNode.ts'

export function createNodeForStore(store: JsonValueStore): BaseValueNode {
  switch (store.type) {
    case JsonSchemaTypeName.Object:
      return new ObjectValueNode(store)

    case JsonSchemaTypeName.Array:
      return new ArrayValueNode(store)

    case JsonSchemaTypeName.String: {
      if (store.foreignKey) {
        return new ForeignKeyValueNode(store)
      }
      if (store.contentMediaType === 'text/markdown') {
        return new MarkdownParentValueNode(store)
      }

      return new StringParentValueNode(store)
    }

    case JsonSchemaTypeName.Number:
      return new NumberValueNode(store)

    case JsonSchemaTypeName.Boolean:
      return new BooleanValueNode(store)

    default:
      return new StringParentValueNode(store)
  }
}
