import React from 'react'
import { ArrayNodeStore } from 'src/widgets/SchemaEditor/model/ArrayNodeStore.ts'
import { SchemaNode } from 'src/widgets/SchemaEditor/model/NodeStore.ts'
import { ObjectNodeStore } from 'src/widgets/SchemaEditor/model/ObjectNodeStore.ts'
import { StringNodeStore } from 'src/widgets/SchemaEditor/model/StringNodeStore.ts'
import { ArrayNode } from 'src/widgets/SchemaEditor/ui/SchemaEditor/ArrayNode.tsx'
import { ObjectNode } from 'src/widgets/SchemaEditor/ui/SchemaEditor/ObjectNode.tsx'
import { StringNode } from 'src/widgets/SchemaEditor/ui/SchemaEditor/StringNode.tsx'

interface NodeFieldsProps {
  node: SchemaNode
  dataTestId?: string
}

export const NodeFields: React.FC<NodeFieldsProps> = ({ node, dataTestId }) => {
  if (node instanceof ObjectNodeStore) {
    return <ObjectNode dataTestId={dataTestId} node={node} />
  }

  if (node instanceof ArrayNodeStore) {
    return <ArrayNode dataTestId={dataTestId} node={node} />
  }

  if (node instanceof StringNodeStore) {
    return <StringNode dataTestId={dataTestId} node={node} />
  }

  return
}
