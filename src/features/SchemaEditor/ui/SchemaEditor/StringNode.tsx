import { Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { StringNodeStore } from 'src/features/SchemaEditor/model/StringNodeStore.ts'
import { StringForeignKeyNode } from 'src/features/SchemaEditor/ui/SchemaEditor/StringForeignKeyNode.tsx'

interface StringNodeProps {
  node: StringNodeStore
  dataTestId?: string
}

export const StringNode: React.FC<StringNodeProps> = observer(({ node, dataTestId }) => {
  if (node.draftForeignKey) {
    return (
      <Flex flexDirection="column" width="100%">
        <StringForeignKeyNode dataTestId={`${dataTestId}-0`} node={node.draftForeignKey} />
      </Flex>
    )
  }

  return null
})
