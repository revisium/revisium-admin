import { Box, Flex, IconButton } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { PropsWithChildren } from 'react'
import { PiDotOutlineFill } from 'react-icons/pi'
import { MdOutlineChevronRight } from 'react-icons/md'
import { SchemaNode } from 'src/widgets/SchemaEditor/model/NodeStore.ts'
import { NodeSettings } from 'src/widgets/SchemaEditor/ui/SchemaEditor/NodeSettings/NodeSettings.tsx'

interface NodeWrapperProps {
  field: React.ReactNode
  fieldClassName?: string
  node?: SchemaNode
  dataTestId?: string
}

export const NodeWrapper: React.FC<NodeWrapperProps & PropsWithChildren> = observer(
  ({ dataTestId, field, fieldClassName, children, node }) => {
    const isCollapsible = node?.isCollapsible
    const isCollapsed = node?.isCollapsed
    const nodeId = node?.nodeId
    const toggleCollapsed = node && 'toggleCollapsed' in node ? node.toggleCollapsed : undefined

    const dotOutlineClass = `dot-outline-${nodeId}`
    const collapseButtonClass = `collapse-button-${nodeId}`

    const hoverStyles =
      isCollapsible && !isCollapsed
        ? {
            [`& .${dotOutlineClass}`]: { visibility: 'hidden' },
            [`& .${collapseButtonClass}`]: { visibility: 'visible' },
          }
        : {}

    return (
      <Flex flexDirection="column" alignSelf="flex-start" width="100%" _hover={hoverStyles}>
        <Flex
          gap="4px"
          alignItems="center"
          height="30px"
          mt="2px"
          mb="2px"
          className={fieldClassName}
          position="relative"
        >
          <Box /* For hover */ position="absolute" ml="-60px" height="100%" width="60px" />
          <Box className={dotOutlineClass} color="gray.300" visibility={isCollapsed ? 'hidden' : 'visible'}>
            <PiDotOutlineFill />
          </Box>
          {isCollapsible && (
            <IconButton
              className={collapseButtonClass}
              visibility={!isCollapsed ? 'hidden' : 'visible'}
              _hover={{
                backgroundColor: 'transparent',
              }}
              ml="-8px"
              position="absolute"
              size="xs"
              color="gray.400"
              variant="ghost"
              onClick={toggleCollapsed}
              width="26px"
              height="26px"
            >
              <Box rotate={isCollapsed ? '0' : '90deg'}>
                <MdOutlineChevronRight />
              </Box>
            </IconButton>
          )}
          {field}
        </Flex>
        {node && node.showSettings && !isCollapsed && (
          <NodeSettings dataTestId={`${dataTestId}-settings`} node={node} />
        )}
        {children && !isCollapsed && (
          <Flex
            ml="7px"
            pl="18px"
            borderLeftWidth={1}
            borderLeftStyle="solid"
            borderLeftColor="white"
            _hover={{
              borderLeftColor: 'blackAlpha.200',
            }}
          >
            {children}
          </Flex>
        )}
      </Flex>
    )
  },
)
