import { Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { BranchPageTitleWidget } from 'src/widgets/BranchPageTitleWidget'

interface RowStackHeaderProps {
  showBreadcrumbs?: boolean
  rowIdInput?: React.ReactNode
  actions?: React.ReactNode
  treeButtons?: React.ReactNode
  switcher?: React.ReactNode
}

export const RowStackHeader: React.FC<RowStackHeaderProps> = ({
  showBreadcrumbs,
  rowIdInput,
  actions,
  treeButtons,
  switcher,
}) => {
  return (
    <Flex
      alignItems="center"
      backgroundColor="white"
      borderBottom="1px solid"
      borderBottomColor="gray.50"
      justifyContent="space-between"
      width="100%"
      position="sticky"
      zIndex={1}
      top={0}
      padding="8px"
    >
      <Flex alignItems="center" gap="8px">
        {showBreadcrumbs && <BranchPageTitleWidget />}
        {showBreadcrumbs && rowIdInput && (
          <Text color="gray" fontWeight="600" fontSize="16px">
            /
          </Text>
        )}
        {rowIdInput}
        {actions}
      </Flex>
      <Flex alignItems="center" gap="8px">
        {treeButtons}
        {switcher}
      </Flex>
    </Flex>
  )
}
