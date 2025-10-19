import { observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import { JsonNumberValueStore } from 'src/entities/Schema/model/value/json-number-value.store.ts'
import { NumberValueNode } from 'src/widgets/TreeDataCard/model/NumberValueNode.ts'
import { Row } from 'src/widgets/TreeDataCard/ui/components'
import { RowNumberEditor } from 'src/widgets/TreeDataCard/ui/editors/primitives/RowNumberEditor/RowNumberEditor.tsx'
import { NodeRendererContext } from './types'

export const NumberRendererComponent: FC<NodeRendererContext> = observer(({ node, isEdit }) => {
  const numberNode = node as NumberValueNode
  const nodeStore = node.getStore() as JsonNumberValueStore

  const handleSetValue = useCallback(
    (value: number) => {
      numberNode.setValue(value)
    },
    [numberNode],
  )

  return (
    <Row node={node}>
      <RowNumberEditor
        value={numberNode.value}
        setValue={handleSetValue}
        defaultValue={numberNode.defaultValue}
        readonly={!isEdit || nodeStore.readOnly}
        dataTestId={node.dataTestId}
      />
    </Row>
  )
})
