import { Box, Flex, Separator, Spacer, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { PiCreditCardLight, PiGearLight, PiGridFourLight, PiSignInLight, PiUsersLight } from 'react-icons/pi'
import { LOGIN_ROUTE } from 'src/shared/config/routes.ts'
import { useViewModel } from 'src/shared/lib'
import { AccountButton } from 'src/widgets/AccountButton'
import { NavigationButton } from 'src/shared/ui'
import { useOrganizationNavigationState } from 'src/widgets/OrganizationSidebar/hooks/useOrganizationNavigationState.ts'
import { OrganizationSidebarViewModel } from 'src/widgets/OrganizationSidebar/model/OrganizationSidebarViewModel.ts'
import { OrganizationHeader } from 'src/widgets/OrganizationSidebar/ui/OrganizationHeader/OrganizationHeader.tsx'

export const OrganizationSidebar: FC = observer(() => {
  const model = useViewModel(OrganizationSidebarViewModel)

  const { isProjectsActive, isMembersActive, isSettingsActive, isBillingActive } = useOrganizationNavigationState()

  return (
    <VStack alignItems="flex-start" gap={0} width="100%" flex={1}>
      <OrganizationHeader organizationId={model.organizationId} />

      <Box width="100%" paddingY="16px">
        <Separator borderColor="newGray.100" />
      </Box>

      <Flex flexDirection="column" width="100%" gap={1}>
        <NavigationButton
          to={model.projectsLink}
          label="Projects"
          icon={<PiGridFourLight />}
          isActive={isProjectsActive}
        />
        {model.canManageMembers && (
          <NavigationButton to={model.membersLink} label="Members" icon={<PiUsersLight />} isActive={isMembersActive} />
        )}
        {model.canAccessSettings && (
          <NavigationButton
            to={model.settingsLink}
            label="Settings"
            icon={<PiGearLight />}
            isActive={isSettingsActive}
          />
        )}
        {model.canAccessBilling && (
          <NavigationButton
            to={model.billingLink}
            label="Billing"
            icon={<PiCreditCardLight />}
            isActive={isBillingActive}
          />
        )}
      </Flex>

      <Spacer />

      <Flex flexDirection="column" width="100%" gap={1}>
        {model.isAuthenticated ? (
          <AccountButton />
        ) : (
          <NavigationButton to={`/${LOGIN_ROUTE}`} label="Sign in" icon={<PiSignInLight />} isActive={false} />
        )}
      </Flex>
    </VStack>
  )
})
