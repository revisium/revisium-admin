import { Box, Flex, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { ArrayNodeStore } from 'src/widgets/SchemaEditor/model/ArrayNodeStore.ts'
import { SchemaNode } from 'src/widgets/SchemaEditor/model/NodeStore.ts'
import { ObjectNodeStore } from 'src/widgets/SchemaEditor/model/ObjectNodeStore.ts'
import { SchemaEditorMode, useSchemaEditor } from 'src/widgets/SchemaEditor/model/SchemaEditorActions.ts'
import { StringNodeStore } from 'src/widgets/SchemaEditor/model/StringNodeStore.ts'
import { useDragAndDrop } from 'src/widgets/SchemaEditor/ui/SchemaEditor/hooks/useDragAndDrop.ts'
import { MenuTypes } from 'src/widgets/SchemaEditor/ui/SchemaEditor/MenuTypes.tsx'
import { NodeFields } from 'src/widgets/SchemaEditor/ui/SchemaEditor/NodeFields.tsx'
import { NodeWrapper } from 'src/widgets/SchemaEditor/ui/SchemaEditor/NodeWrapper.tsx'

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
    (items: SchemaNode) => {
      root.replaceItems(node, items)

      if (items instanceof ObjectNodeStore && !items.$ref) {
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
                <Text
                  data-testid={`${dataTestId}-select-type-button`}
                  color={isDrop ? undefined : 'gray.300'}
                  cursor="pointer"
                  outline={0}
                  _hover={{
                    textDecoration: 'underline',
                    textDecorationColor: 'gray.300',
                  }}
                >
                  {node.draftItems.label}
                  {mode === SchemaEditorMode.Updating && node.draftItems.isDirtyItself && <span>*</span>}
                </Text>
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
