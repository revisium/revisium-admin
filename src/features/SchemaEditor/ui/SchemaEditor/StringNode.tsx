import { Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { StringNodeStore } from 'src/features/SchemaEditor/model/StringNodeStore.ts'
import { StringReferenceNode } from 'src/features/SchemaEditor/ui/SchemaEditor/StringReferenceNode.tsx'

interface StringNodeProps {
  node: StringNodeStore
  dataTestId?: string
}

export const StringNode: React.FC<StringNodeProps> = observer(({ node, dataTestId }) => {
  if (node.draftReference) {
    return (
      <Flex flexDirection="column" width="100%">
        <StringReferenceNode dataTestId={`${dataTestId}-0`} node={node.draftReference} />
      </Flex>
    )
  }

  return null
})
