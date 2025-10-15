import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store'
import { Row } from 'src/widgets/TreeDataCard/ui/components'
import { PlainTextEditor } from 'src/widgets/TreeDataCard/ui/editors/primitives/RowStringEditor/PlainTextEditor/PlainTextEditor'
import { StringParentValueNode } from 'src/widgets/TreeDataCard/model/StringParentValueNode'
import { NodeRendererContext } from './types'

export const StringParentRendererComponent: FC<NodeRendererContext> = observer(({ node, isEdit }) => {
  const stringParentNode = node as StringParentValueNode
  const nodeStore = node.getStore() as JsonStringValueStore

  if (stringParentNode.isCollapsible) {
    return <Row node={node} isCollapsible />
  } else {
    return (
      <Row node={node}>
        <PlainTextEditor node={node} readonly={!isEdit || nodeStore.readOnly} dataTestId={node.dataTestId} />
      </Row>
    )
  }
})
