import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { JsonSchema } from 'src/entities/Schema'
import { createSchemaNode } from 'src/features/SchemaEditor/lib/createSchemaNode.ts'
import { SchemaNode } from 'src/features/SchemaEditor/model/NodeStore.ts'
import { ObjectNodeStore } from 'src/features/SchemaEditor/model/ObjectNodeStore.ts'
import { RootNodeStore } from 'src/features/SchemaEditor/model/RootNodeStore.ts'
import { StringNodeStore } from 'src/features/SchemaEditor/model/StringNodeStore.ts'
import { SchemaEditorMode, useSchemaEditor } from 'src/features/SchemaEditor/model/SchemaEditorActions.ts'
import { FieldEditor } from 'src/features/SchemaEditor/ui/SchemaEditor/FieldEditor.tsx'
import { NodeFields } from 'src/features/SchemaEditor/ui/SchemaEditor/NodeFields.tsx'
import { NodeWrapper } from 'src/features/SchemaEditor/ui/SchemaEditor/NodeWrapper.tsx'
import styles from 'src/features/SchemaEditor/ui/SchemaEditor/FieldEditor.module.scss'

interface RootNodeProps {
  store: RootNodeStore
}

export const RootNode: React.FC<RootNodeProps> = observer(({ store }) => {
  const actions = useSchemaEditor()

  const handleSelect = useCallback(
    (node: SchemaNode, schema: JsonSchema) => {
      const nextNode = createSchemaNode(schema)
      nextNode.setId(node.draftId)
      store.replaceNode(nextNode)
    },
    [store],
  )

  const handleEnter = useCallback((item: SchemaNode) => {
    if (item instanceof ObjectNodeStore) {
      item.addProperty(new StringNodeStore(), { beforeNode: item.draftProperties[0] })
    }
  }, [])

  return (
    <NodeWrapper
      fieldClassName={styles.Root}
      field={
        <FieldEditor
          dataTestId="0"
          isEditable={actions.mode === SchemaEditorMode.Creating || actions.mode === SchemaEditorMode.Updating}
          store={store.node}
          typeClassName={styles.Field}
          onSelect={handleSelect}
          onEnter={handleEnter}
        />
      }
    >
      <NodeFields dataTestId="0" node={store.node} />
    </NodeWrapper>
  )
})
