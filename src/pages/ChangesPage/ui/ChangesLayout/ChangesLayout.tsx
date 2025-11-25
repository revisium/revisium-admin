import { Box, Flex, Spinner, Tabs, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useViewModel } from 'src/shared/lib'
import { ChangesPageViewModel } from 'src/pages/ChangesPage/model/ChangesPageViewModel'
import { RevertButton } from 'src/pages/ChangesPage/ui/RevertButton/RevertButton'
import { CommitButton } from 'src/pages/ChangesPage/ui/CommitButton/CommitButton'

type TabValue = 'tables' | 'rows'

export const ChangesLayout: FC = observer(() => {
  const navigate = useNavigate()
  const location = useLocation()
  const model = useViewModel(ChangesPageViewModel)
  const [openedPopover, setOpenedPopover] = useState<null | 'commit' | 'revert'>(null)

  const currentTab: TabValue =
    location.pathname.endsWith('/rows') || location.search.includes('table=') ? 'rows' : 'tables'

  const handleTabChange = (details: { value: string }) => {
    if (details.value === 'rows') {
      navigate('rows')
    } else {
      navigate('.')
    }
  }

  if (model.showLoading) {
    return (
      <Flex justify="center" align="center" height="200px">
        <Spinner />
      </Flex>
    )
  }

  if (model.showError) {
    return (
      <Flex justify="center" align="center" height="200px">
        <Text color="red.500">Error loading changes</Text>
      </Flex>
    )
  }

  if (model.showEmpty) {
    return (
      <Flex direction="column" justify="center" align="center" height="calc(100vh - 200px)" gap="0.25rem">
        <Text color="newGray.400">{model.emptyStateMessage}</Text>
        <Text fontSize="14px" color="newGray.300">
          {model.emptyStateDescription}
        </Text>
      </Flex>
    )
  }

  if (model.showList) {
    return (
      <Box mb="4rem">
        <Tabs.Root colorPalette="gray" value={currentTab} onValueChange={handleTabChange} mb="1.5rem">
          <Tabs.List>
            <Tabs.Trigger value="tables">Tables ({model.tablesSummary?.total ?? 0})</Tabs.Trigger>
            <Tabs.Trigger value="rows">Row Changes ({model.rowsSummary?.total ?? 0})</Tabs.Trigger>

            {(model.showRevertButton || model.showCommitButton) && (
              <Flex gap="0.5rem" marginLeft="auto">
                {model.showRevertButton && (
                  <RevertButton
                    onClick={() => model.handleRevertChanges()}
                    isOpen={openedPopover === 'revert'}
                    onOpenChange={(open) => setOpenedPopover(open ? 'revert' : null)}
                  />
                )}

                {model.showCommitButton && (
                  <CommitButton
                    onClick={(comment) => model.handleCommitChanges(comment)}
                    isOpen={openedPopover === 'commit'}
                    onOpenChange={(open) => setOpenedPopover(open ? 'commit' : null)}
                  />
                )}
              </Flex>
            )}
          </Tabs.List>
        </Tabs.Root>

        <Outlet context={model} />
      </Box>
    )
  }

  return null
})
