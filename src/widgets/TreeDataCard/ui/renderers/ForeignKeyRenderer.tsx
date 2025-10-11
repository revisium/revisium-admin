import { FC } from 'react'
import { ForeignKeyValueNode } from 'src/widgets/TreeDataCard/model/ForeignKeyValueNode.ts'
import { Row } from 'src/widgets/TreeDataCard/ui/components'
import { ForeignKeyActions } from 'src/widgets/TreeDataCard/ui/editors/plugins/ForeignKeyActions/ForeignKeyActions.tsx'
import { RowForeignKeyEditor } from 'src/widgets/TreeDataCard/ui/editors/primitives/RowForeignKeyEditor/RowForeignKeyEditor.tsx'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store'
import { NodeRendererContext } from 'src/widgets/TreeDataCard/ui/renderers/types.ts'

export const ForeignKeyRendererComponent: FC<NodeRendererContext> = ({ node, isEdit }) => {
  const nodeStore = node.getStore() as JsonStringValueStore

  return (
    <Row node={node}>
      <RowForeignKeyEditor store={nodeStore} readonly={!isEdit || nodeStore.readOnly} dataTestId={node.dataTestId} />
      <ForeignKeyActions node={node as ForeignKeyValueNode} readonly={!isEdit || nodeStore.readOnly} />
    </Row>
  )
}
