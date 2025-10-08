import { FC } from 'react'
import { CreateButton } from 'src/shared/ui'
import { CreateItemValueNode } from 'src/widgets/TreeDataCard/model/CreateItemValueNode.ts'
import { Row } from 'src/widgets/TreeDataCard/ui/components'
import { NodeRendererContext } from './types'

export const CreateItemRendererComponent: FC<NodeRendererContext> = ({ node, isEdit }) => {
  return (
    <Row node={node} skipDot skipField>
      <CreateButton
        dataTestId={`${node.dataTestId}-create-button`}
        disabled={!isEdit}
        title="Item"
        onClick={() => (node as CreateItemValueNode).createItem()}
      />
    </Row>
  )
}
