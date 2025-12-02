import { Flex } from '@chakra-ui/react'
import React from 'react'
import { BranchPageTitleWidget } from 'src/widgets/BranchPageTitleWidget'

interface RowStackHeaderProps {
  showBreadcrumbs?: boolean
  actions?: React.ReactNode
  switcher?: React.ReactNode
}

export const RowStackHeader: React.FC<RowStackHeaderProps> = ({ showBreadcrumbs, actions, switcher }) => {
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
        {actions}
      </Flex>
      {switcher}
    </Flex>
  )
}
