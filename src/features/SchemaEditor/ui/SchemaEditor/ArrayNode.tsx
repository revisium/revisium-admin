import { Box, Flex, MenuButton, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { JsonSchema } from 'src/entities/Schema'
import { createSchemaNode } from 'src/features/SchemaEditor/lib/createSchemaNode.ts'
import { ArrayNodeStore } from 'src/features/SchemaEditor/model/ArrayNodeStore.ts'
import { SchemaNode } from 'src/features/SchemaEditor/model/NodeStore.ts'
import { ObjectNodeStore } from 'src/features/SchemaEditor/model/ObjectNodeStore.ts'
import { SchemaEditorMode, useSchemaEditor } from 'src/features/SchemaEditor/model/SchemaEditorActions.ts'
import { StringNodeStore } from 'src/features/SchemaEditor/model/StringNodeStore.ts'
import { useDragAndDrop } from 'src/features/SchemaEditor/ui/SchemaEditor/hooks/useDragAndDrop.ts'
import { MenuTypes } from 'src/features/SchemaEditor/ui/SchemaEditor/MenuTypes.tsx'
import { NodeFields } from 'src/features/SchemaEditor/ui/SchemaEditor/NodeFields.tsx'
import { NodeWrapper } from 'src/features/SchemaEditor/ui/SchemaEditor/NodeWrapper.tsx'

interface ArrayNodeProps {
  node: ArrayNodeStore
  dataTestId?: string
}

export const ArrayNode: React.FC<ArrayNodeProps> = observer(({ node, dataTestId }) => {
  const { mode, root } = useSchemaEditor()

  const handleDrop = useCallback(
    (draggingNode: SchemaNode) => {
      const store = node.draftItems

      if (store instanceof ObjectNodeStore) {
        root.addProperty(store, draggingNode, { beforeNode: store.draftProperties[0] })
      } else if (store instanceof ArrayNodeStore) {
        root.replaceItems(store, draggingNode)
      }
    },
    [node.draftItems, root],
  )

  const { dragAndDropRef, isDrop, isDraggedOver, isDisabledDrop } = useDragAndDrop(node.draftItems, true, handleDrop)

  const handleSelect = useCallback(
    (schema: JsonSchema) => {
      const items = createSchemaNode(schema)
      root.replaceItems(node, items)

      if (items instanceof ObjectNodeStore) {
        root.addProperty(items, new StringNodeStore())
      }
    },
    [node, root],
  )

  return (
    <Flex flexDirection="column" width="100%">
      <NodeWrapper
        field={
          <MenuTypes
            dataTestId={dataTestId}
            currentSchema={node.draftItems.getSchema({ skipObjectProperties: true })}
            onSelect={handleSelect}
            menuButton={
              <Box
                data-testid={isDrop && `${dataTestId}-drop`}
                ref={dragAndDropRef}
                borderWidth={1}
                borderStyle="dashed"
                borderColor={isDrop ? 'gray.400' : '#00000000'}
                backgroundColor={isDraggedOver ? 'gray.200' : undefined}
                color={isDisabledDrop ? 'gray.300' : undefined}
              >
                <MenuButton
                  data-testid={`${dataTestId}-select-type-button`}
                  as={Text}
                  color={isDrop ? undefined : 'gray.300'}
                  cursor="pointer"
                  outline={0}
                  _hover={{
                    textDecoration: 'underline',
                    textDecorationColor: 'gray.300',
                  }}
                >
                  {node.draftItems.type}
                  {mode === SchemaEditorMode.Updating && node.draftItems.isDirtyItself && <span>*</span>}
                </MenuButton>
              </Box>
            }
          />
        }
      >
        <NodeFields dataTestId={`${dataTestId}-0`} node={node.draftItems} />
      </NodeWrapper>
    </Flex>
  )
})
