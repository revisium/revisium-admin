import { FC } from 'react'
import { JsonObjectValueStore } from 'src/entities/Schema/model/value/json-object-value.store.ts'
import { useRowEditorActions } from 'src/features/CreateRowCard/model/RowEditorActions.ts'
import { Row } from 'src/widgets/TreeDataCard/ui/components'
import { FilePluginActions } from 'src/widgets/TreeDataCard/ui/editors/plugins/FilePluginActions/FilePluginActions.tsx'
import { NodeRendererContext } from 'src/widgets/TreeDataCard/ui/renderers/types.ts'

export const FileRendererComponent: FC<NodeRendererContext> = ({ node, isEdit }) => {
  const actions = useRowEditorActions()
  const nodeStore = node.getStore() as JsonObjectValueStore

  return (
    <Row node={node} isCollapsible skipMore>
      <FilePluginActions readonly={!isEdit} store={nodeStore} onUpload={actions.onUploadFile} />
    </Row>
  )
}
