import { FC } from 'react'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'
import { Row } from 'src/widgets/TreeDataCard/ui/components'
import { NodeRendererContext } from 'src/widgets/TreeDataCard/ui/renderers/types.ts'
import { PlainTextEditor } from 'src/widgets/TreeDataCard/ui/editors/primitives/RowStringEditor/PlainTextEditor/PlainTextEditor'

export const StringChildRendererComponent: FC<NodeRendererContext> = ({ node, isEdit }) => {
  const nodeStore = node.getStore() as JsonStringValueStore

  return (
    <Row node={node} skipField skipDot>
      <PlainTextEditor
        node={node.parent || undefined}
        readonly={!isEdit || nodeStore.readOnly}
        dataTestId={node.dataTestId}
      />
    </Row>
  )
}
