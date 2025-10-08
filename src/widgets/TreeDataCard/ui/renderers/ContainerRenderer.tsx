import { FC } from 'react'
import { Row } from 'src/widgets/TreeDataCard/ui/components'
import { NodeRendererContext } from './types'

export const ContainerRendererComponent: FC<NodeRendererContext> = ({ node }) => {
  return <Row node={node} isCollapsible />
}
