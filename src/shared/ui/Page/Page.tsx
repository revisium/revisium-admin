import { Box, Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { PiListLight } from 'react-icons/pi'
import { container } from 'src/shared/lib'
import { SidebarStateViewModel } from 'src/shared/model'
import { SidebarPanel } from './SidebarPanel/SidebarPanel.tsx'

const SIDEBAR_WIDTH = 288
const COLLAPSED_STRIP_WIDTH = 48
const ANIMATION_DURATION = '0.2s'

interface PageProps {
  sidebar?: React.ReactElement
  title?: React.ReactElement
  actions?: React.ReactElement
  hideSidebar?: boolean
  footer?: React.ReactElement
}

export const Page: React.FC<PageProps & React.PropsWithChildren> = observer(
  ({ hideSidebar, sidebar, title, actions, children, footer }) => {
    const sidebarState = container.get(SidebarStateViewModel)

    useEffect(() => {
      sidebarState.initKeyboard()
      return () => {
        sidebarState.disposeKeyboard()
      }
    }, [sidebarState])

    const showSidebar = !hideSidebar
    const isCollapsed = showSidebar && sidebarState.isCollapsed
    const isOverlay = isCollapsed && sidebarState.isHoverExpanded

    const sidebarContainerWidth = showSidebar
      ? isCollapsed
        ? `${COLLAPSED_STRIP_WIDTH}px`
        : `${SIDEBAR_WIDTH}px`
      : '0px'

    return (
      <Flex minHeight="100vh">
        {showSidebar && (
          <Flex
            width={sidebarContainerWidth}
            minWidth={sidebarContainerWidth}
            flexShrink={0}
            height="100vh"
            top={0}
            position="sticky"
            transition={`width ${ANIMATION_DURATION} ease, min-width ${ANIMATION_DURATION} ease`}
            overflow="hidden"
          >
            {isCollapsed ? (
              <Flex
                width={`${COLLAPSED_STRIP_WIDTH}px`}
                minWidth={`${COLLAPSED_STRIP_WIDTH}px`}
                height="100vh"
                flexDirection="column"
                alignItems="center"
                paddingTop="20px"
                onMouseEnter={sidebarState.startHoverIntent}
                onMouseLeave={sidebarState.cancelHoverIntent}
              >
                <Box
                  as="button"
                  fontSize="20px"
                  color="newGray.400"
                  cursor="pointer"
                  _hover={{ color: 'newGray.600' }}
                  display="flex"
                  alignItems="center"
                  onClick={sidebarState.toggle}
                  aria-label="Toggle sidebar"
                >
                  <PiListLight />
                </Box>
              </Flex>
            ) : (
              <Flex
                width={`${SIDEBAR_WIDTH}px`}
                minWidth={`${SIDEBAR_WIDTH}px`}
                borderRight="1px solid"
                borderRightColor="newGray.100"
                flexDirection="column"
                justifyContent={sidebar ? 'space-between' : 'flex-end'}
                padding="16px"
                height="100vh"
              >
                <SidebarPanel sidebar={sidebar} footer={footer} />
              </Flex>
            )}
          </Flex>
        )}

        {isCollapsed && (
          <>
            <Box
              position="fixed"
              left={0}
              top={0}
              width="100vw"
              height="100vh"
              zIndex={9}
              pointerEvents={isOverlay ? 'auto' : 'none'}
              onClick={sidebarState.dismissOverlay}
            />
            <Flex
              position="fixed"
              left={0}
              top={0}
              width={`${SIDEBAR_WIDTH}px`}
              height="100vh"
              zIndex={10}
              backgroundColor="white"
              borderRight="1px solid"
              borderRightColor="newGray.100"
              flexDirection="column"
              justifyContent={sidebar ? 'space-between' : 'flex-end'}
              padding="16px"
              boxShadow={isOverlay ? '4px 0 12px rgba(0, 0, 0, 0.08)' : 'none'}
              transform={isOverlay ? 'translateX(0)' : `translateX(-${SIDEBAR_WIDTH}px)`}
              transition={`transform ${ANIMATION_DURATION} ease, box-shadow ${ANIMATION_DURATION} ease`}
              onMouseLeave={sidebarState.startLeaveIntent}
              onMouseEnter={sidebarState.cancelLeaveIntent}
              pointerEvents={isOverlay ? 'auto' : 'none'}
            >
              <SidebarPanel sidebar={sidebar} footer={footer} />
            </Flex>
          </>
        )}

        <Flex flex={1} minWidth={0} flexDirection="column" alignItems="center">
          {(title || actions) && (
            <Flex
              alignItems="center"
              backgroundColor="white"
              borderBottom="1px solid"
              borderBottomColor="gray.50"
              justifyContent="space-between"
              maxWidth="900px"
              padding="8px"
              width="100%"
              position="sticky"
              zIndex={1}
              top={0}
            >
              {title}
              {actions}
            </Flex>
          )}

          <Flex flex={1} flexDirection="column" maxWidth="900px" padding="1rem 1rem 0rem 1rem" width="100%">
            {children}
          </Flex>
        </Flex>
      </Flex>
    )
  },
)
