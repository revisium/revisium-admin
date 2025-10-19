import { observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'
import { StringChildValueNode } from 'src/widgets/TreeDataCard/model/StringChildValueNode.ts'
import { Row } from 'src/widgets/TreeDataCard/ui/components'
import { NodeRendererContext } from 'src/widgets/TreeDataCard/ui/renderers/types.ts'
import { PlainTextEditor } from 'src/widgets/TreeDataCard/ui/editors/primitives/RowStringEditor/PlainTextEditor/PlainTextEditor'

export const StringChildRendererComponent: FC<NodeRendererContext> = observer(({ node, isEdit }) => {
  const stringChildNode = node as StringChildValueNode
  const nodeStore = node.getStore() as JsonStringValueStore

  const handleSetValue = useCallback(
    (value: string) => {
      stringChildNode.setValue(value)
    },
    [stringChildNode],
  )

  return (
    <Row node={node} skipField skipDot>
      <PlainTextEditor
        value={stringChildNode.value}
        setValue={handleSetValue}
        readonly={!isEdit || nodeStore.readOnly}
        dataTestId={node.dataTestId}
      />
    </Row>
  )
})
