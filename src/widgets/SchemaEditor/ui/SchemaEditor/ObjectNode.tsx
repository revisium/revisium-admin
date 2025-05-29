import { Box, Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { SchemaNode } from 'src/widgets/SchemaEditor/model/NodeStore.ts'
import { ObjectNodeStore } from 'src/widgets/SchemaEditor/model/ObjectNodeStore.ts'
import { useSchemaEditor } from 'src/widgets/SchemaEditor/model/SchemaEditorActions.ts'
import { StringNodeStore } from 'src/widgets/SchemaEditor/model/StringNodeStore.ts'
import { FieldEditor } from 'src/widgets/SchemaEditor/ui/SchemaEditor/FieldEditor.tsx'
import { NodeFields } from 'src/widgets/SchemaEditor/ui/SchemaEditor/NodeFields.tsx'
import { NodeWrapper } from 'src/widgets/SchemaEditor/ui/SchemaEditor/NodeWrapper.tsx'
import styles from 'src/widgets/SchemaEditor/ui/SchemaEditor/FieldEditor.module.scss'
import { CreateButton } from 'src/shared/ui'

interface ObjectNodeProps {
  node: ObjectNodeStore
  dataTestId?: string
}

export const ObjectNode: React.FC<ObjectNodeProps> = observer(({ node, dataTestId }) => {
  const { root } = useSchemaEditor()

  const handleCreateClick = useCallback(() => {
    root.addProperty(node, new StringNodeStore())
  }, [node, root])

  const handleBlur = useCallback(
    (item: SchemaNode) => {
      if (!item.draftId) {
        root.removeProperty(node, item)
      }
    },
    [node, root],
  )

  const handleRemove = useCallback(
    (item: SchemaNode) => {
      root.removeProperty(node, item)
    },
    [node, root],
  )

  const handleSelect = useCallback(
    (item: SchemaNode, nextNode: SchemaNode) => {
      root.replaceProperty(node, item, nextNode)
    },
    [node, root],
  )

  const handleEnter = useCallback(
    (item: SchemaNode) => {
      if (item instanceof ObjectNodeStore) {
        root.addProperty(item, new StringNodeStore(), { beforeNode: item.draftProperties[0] })
      } else {
        root.addProperty(node, new StringNodeStore(), { afterNode: item })
      }
    },
    [node, root],
  )

  return (
    <Flex flexDirection="column" width="100%">
      {node.draftProperties.map((property, index) => (
        <NodeWrapper
          key={property.nodeId}
          fieldClassName={styles.Root}
          field={
            <FieldEditor
              dataTestId={`${dataTestId}-${index}`}
              store={property}
              typeClassName={styles.Field}
              onSelect={handleSelect}
              onBlur={handleBlur}
              onRemove={handleRemove}
              onEnter={handleEnter}
            />
          }
        >
          <NodeFields dataTestId={`${dataTestId}-${index}`} node={property} />
        </NodeWrapper>
      ))}

      {node.showingCreateField && (
        <Box ml="-14px">
          <CreateButton
            dataTestId={`${dataTestId}-create-field-button`}
            title="Field"
            isDisabled={node.isDisabledCreateField}
            onClick={handleCreateClick}
          />
        </Box>
      )}
    </Flex>
  )
})
