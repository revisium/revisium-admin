import { Box, Flex, IconButton } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { PropsWithChildren } from 'react'
import { PiCaretDownBold, PiCaretRightBold, PiDotOutlineFill } from 'react-icons/pi'

interface NodeStore {
  nodeId: string
  isCollapsible?: boolean
  isCollapsed?: boolean
  toggleCollapsed?: () => void
}

interface NodeWrapperProps {
  field: React.ReactNode
  fieldClassName?: string
  node?: NodeStore
}

export const NodeWrapper: React.FC<NodeWrapperProps & PropsWithChildren> = observer(
  ({ field, fieldClassName, children, node }) => {
    const isCollapsible = node?.isCollapsible
    const isCollapsed = node?.isCollapsed
    const nodeId = node?.nodeId

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
              color="gray.300"
              variant="ghost"
              onClick={node?.toggleCollapsed}
              width="26px"
              height="26px"
            >
              {isCollapsed ? <PiCaretRightBold /> : <PiCaretDownBold />}
            </IconButton>
          )}
          {field}
        </Flex>
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
