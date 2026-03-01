import { Flex, Text } from '@chakra-ui/react'
import { BreadcrumbEditableProps } from '@revisium/schema-toolkit-ui'
import React from 'react'
import { BranchPageTitleWidget } from 'src/widgets/BranchPageTitleWidget'

interface RowStackHeaderProps {
  showBreadcrumbs?: boolean
  tableTitle?: string
  rowIdEditable?: BreadcrumbEditableProps
  rowIdReadonly?: string
  onLastBreadcrumbClick?: () => void
  actions?: React.ReactNode
  actionsMenu?: React.ReactNode
  switcher?: React.ReactNode
  search?: React.ReactNode
}

export const RowStackHeader: React.FC<RowStackHeaderProps> = ({
  showBreadcrumbs,
  tableTitle,
  rowIdEditable,
  rowIdReadonly,
  onLastBreadcrumbClick,
  actions,
  actionsMenu,
  switcher,
  search,
}) => {
  return (
    <Flex
      alignItems="flex-start"
      backgroundColor="white"
      justifyContent="space-between"
      width="100%"
      position="sticky"
      zIndex={3}
      top={0}
      px={3}
      pt="32px"
      pb="48px"
    >
      <Flex alignItems="center" gap="8px">
        {showBreadcrumbs && (
          <BranchPageTitleWidget
            rowIdEditable={rowIdEditable}
            rowIdReadonly={rowIdReadonly}
            onLastSegmentClick={onLastBreadcrumbClick}
          />
        )}
        {tableTitle && (
          <Text fontWeight="500" fontSize="14px" color="gray.700">
            {tableTitle}
          </Text>
        )}
        {actions}
      </Flex>
      <Flex alignItems="center" gap="8px">
        {search}
        {actionsMenu}
        {switcher}
      </Flex>
    </Flex>
  )
}
