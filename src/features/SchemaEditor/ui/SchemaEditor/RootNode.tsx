import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { SchemaNode } from 'src/features/SchemaEditor/model/NodeStore.ts'
import { ObjectNodeStore } from 'src/features/SchemaEditor/model/ObjectNodeStore.ts'
import { RootNodeStore } from 'src/features/SchemaEditor/model/RootNodeStore.ts'
import { StringNodeStore } from 'src/features/SchemaEditor/model/StringNodeStore.ts'
import { FieldEditor } from 'src/features/SchemaEditor/ui/SchemaEditor/FieldEditor.tsx'
import { NodeFields } from 'src/features/SchemaEditor/ui/SchemaEditor/NodeFields.tsx'
import { NodeWrapper } from 'src/features/SchemaEditor/ui/SchemaEditor/NodeWrapper.tsx'
import styles from 'src/features/SchemaEditor/ui/SchemaEditor/FieldEditor.module.scss'

interface RootNodeProps {
  store: RootNodeStore
}

export const RootNode: React.FC<RootNodeProps> = observer(({ store }) => {
  const handleSelect = useCallback(
    (node: SchemaNode, nextNode: SchemaNode) => {
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
