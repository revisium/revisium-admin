import { Flex } from '@chakra-ui/react'
import { FC, ReactNode } from 'react'
import { BaseValueNode } from 'src/widgets/TreeDataCard/model/BaseValueNode.ts'
import { Dot } from './Dot'
import { Field } from './Field'
import { Guides } from './Guides'
import { More } from './More'
import { useRowEditorActions } from 'src/features/CreateRowCard/model/RowEditorActions'

interface IndentedRowProps {
  node: BaseValueNode
  isCollapsible?: boolean
  skipDot?: boolean
  skipField?: boolean
  skipMore?: boolean
  children?: ReactNode
}

export const Row: FC<IndentedRowProps> = ({
  node,
  children,
  isCollapsible,
  skipDot,
  skipField,
  skipMore,
}: IndentedRowProps) => {
  const actions = useRowEditorActions()

  const isCollapsed = node.isExpandable && !node.expanded

  return (
    <Flex
      width="100%"
      onMouseEnter={() => actions.onOverNode(node.getStore())}
      onMouseLeave={() => actions.onOverNode(null)}
      position="relative"
      className="group"
    >
      <Guides guides={node.guides} />
      <Flex width="100%">
        {!skipDot && (
          <Dot isCollapsed={isCollapsed} isCollapsible={isCollapsible} toggleCollapsed={() => node.toggleExpanded()} />
        )}
        {!skipField && <Field node={node} />}
        {!skipMore && isCollapsed && <More onClick={() => node.toggleExpanded()} />}
        {children}
      </Flex>
    </Flex>
  )
}
