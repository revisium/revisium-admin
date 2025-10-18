import { FC, useCallback } from 'react'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'
import { MarkdownChildValueNode } from 'src/widgets/TreeDataCard'
import { Row } from 'src/widgets/TreeDataCard/ui/components'
import { MarkdownEditor } from 'src/widgets/TreeDataCard/ui/editors/primitives/RowStringEditor/MarkdownEditor/MarkdownEditor'
import { NodeRendererContext } from 'src/widgets/TreeDataCard/ui/renderers/types.ts'

export const MarkdownChildRendererComponent: FC<NodeRendererContext> = ({ node, isEdit }) => {
  const childNode = node as MarkdownChildValueNode
  const nodeStore = node.getStore() as JsonStringValueStore

  const handleSetValue = useCallback(
    (value: string) => {
      childNode.setValue(value)
    },
    [childNode],
  )

  return (
    <Row node={node} skipField skipDot>
      <MarkdownEditor
        value={childNode.value}
        setValue={handleSetValue}
        readonly={!isEdit || nodeStore.readOnly}
        dataTestId={node.dataTestId}
      />
    </Row>
  )
}
