import { FC } from 'react'
import { JsonBooleanValueStore } from 'src/entities/Schema/model/value/json-boolean-value.store.ts'
import { Row } from 'src/widgets/TreeDataCard/ui/components'
import { RowBooleanEditor } from 'src/widgets/TreeDataCard/ui/editors/primitives/RowBooleanEditor/RowBooleanEditor.tsx'
import { NodeRendererContext } from './types'

export const BooleanRendererComponent: FC<NodeRendererContext> = ({ node, isEdit }) => {
  const nodeStore = node.getStore() as JsonBooleanValueStore

  return (
    <Row node={node}>
      <RowBooleanEditor store={nodeStore} readonly={!isEdit || nodeStore.readOnly} dataTestId={node.dataTestId} />
    </Row>
  )
}
