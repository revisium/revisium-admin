import { Box, Button, Flex, Spinner, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, ReactElement, ReactNode } from 'react'
import { PiPlusLight, PiUsersLight } from 'react-icons/pi'
import { Page } from 'src/shared/ui/Page/Page.tsx'

export interface IMembersPageModel {
  showInitialLoading: boolean
  showError: boolean
  showNoMembers: boolean
  canAddMember: boolean
  totalCount: number
  hasNextPage: boolean
  isLoading: boolean
  tryToFetchNextPage(): Promise<void>
}

interface MembersPageLayoutProps {
  model: IMembersPageModel
  sidebar: ReactElement
  label: string
  emptyTitle: string
  emptySubtitle: string
  subtitle: string
  onAddClick: () => void
  modal: ReactNode
  children: ReactNode
}

export const MembersPageLayout: FC<MembersPageLayoutProps> = observer(
  ({ model, sidebar, label, emptyTitle, emptySubtitle, subtitle, onAddClick, modal, children }) => {
    if (model.showInitialLoading) {
      return (
        <Page sidebar={sidebar}>
          <Flex justify="center" align="center" height="200px">
            <Spinner />
          </Flex>
        </Page>
      )
    }

    if (model.showError) {
      return (
        <Page sidebar={sidebar}>
          <Flex justify="center" align="center" height="200px">
            <Text color="red.500">Error loading {label.toLowerCase()}</Text>
          </Flex>
        </Page>
      )
    }

    if (model.showNoMembers) {
      return (
        <Page sidebar={sidebar}>
          <Box mb="4rem">
            <Flex justify="center" align="center" height="200px" flexDirection="column" gap={4}>
              <Box textAlign="center">
                <PiUsersLight size={48} color="var(--chakra-colors-newGray-400)" style={{ margin: '0 auto' }} />
                <Text color="newGray.400" mt={2}>
                  {emptyTitle}
                </Text>
                <Text fontSize="xs" color="newGray.400" mt={1}>
                  {emptySubtitle}
                </Text>
              </Box>
              {model.canAddMember && (
                <Button color="gray" variant="ghost" size="sm" onClick={onAddClick} focusRing="none">
                  <PiPlusLight />
                  Add
                </Button>
              )}
            </Flex>
          </Box>
          {modal}
        </Page>
      )
    }

    return (
      <Page sidebar={sidebar}>
        <Box mb="4rem">
          <Flex justify="space-between" align="center" marginBottom="0.5rem">
            <Text fontSize="20px" fontWeight="600" color="newGray.500">
              {label} ({model.totalCount})
            </Text>
            {model.canAddMember && (
              <Button color="gray" variant="ghost" size="sm" onClick={onAddClick}>
                <PiPlusLight />
                Add
              </Button>
            )}
          </Flex>
          <Text fontSize="xs" color="newGray.400" marginBottom="1.5rem">
            {subtitle}
          </Text>

          <VStack align="stretch" gap={3}>
            {children}
          </VStack>

          {model.hasNextPage && (
            <Flex justify="center" mt={4}>
              <Button variant="plain" onClick={() => model.tryToFetchNextPage()} loading={model.isLoading}>
                Load more
              </Button>
            </Flex>
          )}
        </Box>
        {modal}
      </Page>
    )
  },
)
