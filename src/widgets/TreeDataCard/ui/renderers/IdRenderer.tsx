import { observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'
import { IdValueNode } from 'src/widgets/TreeDataCard/model/IdValueNode.ts'
import { Row } from 'src/widgets/TreeDataCard/ui/components'
import { PlainTextEditor } from 'src/widgets/TreeDataCard/ui/editors/primitives/RowStringEditor/PlainTextEditor/PlainTextEditor'
import { NodeRendererContext } from 'src/widgets/TreeDataCard/ui/renderers/types.ts'

export const IdRendererComponent: FC<NodeRendererContext> = observer(({ node, isEdit }) => {
  const idNode = node as IdValueNode

  const nodeStore = node.getStore() as JsonStringValueStore

  const handleSetValue = useCallback(
    (value: string) => {
      idNode.setValue(value)
    },
    [idNode],
  )

  return (
    <Row node={node}>
      <PlainTextEditor
        value={idNode.value}
        setValue={handleSetValue}
        readonly={!isEdit || nodeStore.readOnly}
        dataTestId={node.dataTestId}
      />
    </Row>
  )
})
