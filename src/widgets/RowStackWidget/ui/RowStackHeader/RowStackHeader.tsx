import { Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { BranchPageTitleWidget } from 'src/widgets/BranchPageTitleWidget'

interface RowStackHeaderProps {
  showBreadcrumbs?: boolean
  tableTitle?: string
  rowIdInput?: React.ReactNode
  actions?: React.ReactNode
  actionsMenu?: React.ReactNode
  switcher?: React.ReactNode
  search?: React.ReactNode
}

export const RowStackHeader: React.FC<RowStackHeaderProps> = ({
  showBreadcrumbs,
  tableTitle,
  rowIdInput,
  actions,
  actionsMenu,
  switcher,
  search,
}) => {
  return (
    <Flex
      alignItems="center"
      backgroundColor="white"
      justifyContent="space-between"
      width="100%"
      position="sticky"
      zIndex={1}
      top={0}
      padding="8px"
    >
      <Flex alignItems="center" gap="8px">
        {showBreadcrumbs && <BranchPageTitleWidget />}
        {tableTitle && (
          <Text fontWeight="500" fontSize="14px" color="gray.700">
            {tableTitle}
          </Text>
        )}
        {showBreadcrumbs && rowIdInput && (
          <Text color="gray" fontWeight="600" fontSize="16px">
            /
          </Text>
        )}
        {rowIdInput}
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
