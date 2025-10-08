import { FC } from 'react'
import { JsonNumberValueStore } from 'src/entities/Schema/model/value/json-number-value.store.ts'
import { Row } from 'src/widgets/TreeDataCard/ui/components'
import { RowNumberEditor } from 'src/widgets/TreeDataCard/ui/editors/primitives/RowNumberEditor/RowNumberEditor.tsx'
import { NodeRendererContext } from './types'

export const NumberRendererComponent: FC<NodeRendererContext> = ({ node, isEdit }) => {
  const nodeStore = node.getStore() as JsonNumberValueStore

  return (
    <Row node={node}>
      <RowNumberEditor store={nodeStore} readonly={!isEdit || nodeStore.readOnly} dataTestId={node.dataTestId} />
    </Row>
  )
}
