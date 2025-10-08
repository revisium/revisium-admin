import { FC } from 'react'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'
import { Row } from 'src/widgets/TreeDataCard/ui/components'
import { RowStringEditor } from 'src/widgets/TreeDataCard/ui/editors/primitives/RowStringEditor/RowStringEditor.tsx'
import { NodeRendererContext } from './types'

export const IdRendererComponent: FC<NodeRendererContext> = ({ node, isEdit }) => {
  const nodeStore = node.getStore() as JsonStringValueStore

  return (
    <Row node={node}>
      <RowStringEditor store={nodeStore} readonly={!isEdit || nodeStore.readOnly} dataTestId={node.dataTestId} />
    </Row>
  )
}
