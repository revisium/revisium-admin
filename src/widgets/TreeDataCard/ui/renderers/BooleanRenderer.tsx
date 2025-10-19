import { observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import { JsonBooleanValueStore } from 'src/entities/Schema/model/value/json-boolean-value.store.ts'
import { BooleanValueNode } from 'src/widgets/TreeDataCard/model/BooleanValueNode.ts'
import { Row } from 'src/widgets/TreeDataCard/ui/components'
import { RowBooleanEditor } from 'src/widgets/TreeDataCard/ui/editors/primitives/RowBooleanEditor/RowBooleanEditor.tsx'
import { NodeRendererContext } from './types'

export const BooleanRendererComponent: FC<NodeRendererContext> = observer(({ node, isEdit }) => {
  const nodeStore = node.getStore() as JsonBooleanValueStore
  const booleanNode = node as BooleanValueNode

  const handleSetValue = useCallback(
    (value: boolean) => {
      booleanNode.setValue(value)
    },
    [booleanNode],
  )

  return (
    <Row node={node}>
      <RowBooleanEditor
        value={booleanNode.value}
        setValue={handleSetValue}
        readonly={!isEdit || nodeStore.readOnly}
        dataTestId={node.dataTestId}
      />
    </Row>
  )
})
