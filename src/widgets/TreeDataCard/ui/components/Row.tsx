import { Box, Flex } from '@chakra-ui/react'
import { FC, ReactNode } from 'react'
import { RemoveButton } from 'src/shared/ui/RemoveButton/RemoveButton.tsx'
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
      data-testid={`${node.dataTestId}-field`}
    >
      <Guides guides={node.guides} />
      <Flex width="100%" alignItems="center">
        <Flex>
          {!skipDot && (
            <Dot
              isCollapsed={isCollapsed}
              isCollapsible={isCollapsible}
              toggleCollapsed={() => node.toggleExpanded()}
            />
          )}
          {!skipField && <Field node={node} />}
          {children}
        </Flex>
        {!skipMore && isCollapsed && <More onClick={() => node.toggleExpanded()} label={node.collapseChildrenLabel} />}
        {node.onDelete && (
          <Box
            display="none"
            _groupHover={{
              display: 'block',
            }}
          >
            <RemoveButton
              dataTestId={`${node.dataTestId}-remove-button`}
              height="26px"
              aria-label="remove"
              color="gray.400"
              _hover={{ color: 'gray.400' }}
              onClick={node.onDelete}
            />
          </Box>
        )}
      </Flex>
    </Flex>
  )
}
