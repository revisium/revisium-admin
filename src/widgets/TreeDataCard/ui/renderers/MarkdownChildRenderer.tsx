import { FC } from 'react'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'
import { Row } from 'src/widgets/TreeDataCard/ui/components'
import { MarkdownEditor } from 'src/widgets/TreeDataCard/ui/editors/primitives/RowStringEditor/MarkdownEditor/MarkdownEditor'
import { NodeRendererContext } from 'src/widgets/TreeDataCard/ui/renderers/types.ts'

export const MarkdownChildRendererComponent: FC<NodeRendererContext> = ({ node, isEdit }) => {
  const nodeStore = node.getStore() as JsonStringValueStore

  return (
    <Row node={node} skipField skipDot>
      <MarkdownEditor store={nodeStore} readonly={!isEdit || nodeStore.readOnly} dataTestId={node.dataTestId} />
    </Row>
  )
}
