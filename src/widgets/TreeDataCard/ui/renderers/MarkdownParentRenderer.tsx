import { FC } from 'react'
import { Row } from 'src/widgets/TreeDataCard/ui/components'
import { NodeRendererContext } from './types'

export const MarkdownParentRendererComponent: FC<NodeRendererContext> = ({ node }) => {
  return <Row node={node} isCollapsible />
}