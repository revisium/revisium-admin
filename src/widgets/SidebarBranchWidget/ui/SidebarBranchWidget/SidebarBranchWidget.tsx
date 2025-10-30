import { Box, Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { PiArrowCounterClockwiseBold, PiCheckBold, PiGitBranchLight, PiPlusBold } from 'react-icons/pi'
import { useViewModel } from 'src/shared/lib'
import { useProjectPageModel } from 'src/shared/model/ProjectPageModel/hooks/useProjectPageModel.ts'
import { SidebarBranchWidgetModel } from 'src/widgets/SidebarBranchWidget/model/SidebarBranchWidgetModel.ts'
import { ActionButton } from 'src/widgets/SidebarBranchWidget/ui/ActionButton/ActionButton.tsx'
import { BranchButton } from 'src/widgets/SidebarBranchWidget/ui/BranchesMenu/BranchButton.tsx'
import { CreateRevisionContent } from 'src/widgets/SidebarBranchWidget/ui/CreateRevisionContent/CreateRevisionContent.tsx'
import { RevertContent } from 'src/widgets/SidebarBranchWidget/ui/RevertContent/RevertContent.tsx'
import { CreateBranchContent } from 'src/widgets/SidebarBranchWidget/ui/CreateBranchContent/CreateBranchContent.tsx'

export const SidebarBranchWidget = observer(() => {
  const projectPageModel = useProjectPageModel()
  const model = useViewModel(SidebarBranchWidgetModel, projectPageModel)

  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  if (model.isLoading) {
    return null
  }

  return (
    <Flex
      alignItems="center"
      backgroundColor={isPopoverOpen ? 'gray.900/4' : 'transparent'}
      _hover={{ backgroundColor: 'newGray.100' }}
      borderRadius="0.25rem"
      height="30px"
      paddingLeft="0.5rem"
      paddingRight="0.5rem"
      width="100%"
      className="group"
    >
      <Flex width="100%" alignItems="center" justifyContent="space-between">
        <Flex cursor="pointer" gap="4px" alignItems="center" minWidth="0">
          <Box color="newGray.400">
            <PiGitBranchLight />
          </Box>
          <BranchButton model={model} onAction={async () => {}} onOpenChange={setIsPopoverOpen}></BranchButton>
        </Flex>
        {model.showActionsButton && (
          <Flex
            pl="16px"
            gap="8px"
            display="flex"
            opacity={isPopoverOpen ? 1 : 0}
            pointerEvents={isPopoverOpen ? 'auto' : 'none'}
            _groupHover={{ opacity: 1, pointerEvents: 'auto' }}
          >
            {model.showBranchButton && (
              <ActionButton
                content={
                  <CreateBranchContent onClick={model.handleCreateBranch} onClose={() => setIsPopoverOpen(false)} />
                }
                onOpenChange={setIsPopoverOpen}
                tooltip="Create branch"
              >
                <PiPlusBold />
              </ActionButton>
            )}
            {model.showRevertButton && (
              <ActionButton
                content={<RevertContent onClick={model.handleRevertChanges} onClose={() => setIsPopoverOpen(false)} />}
                onOpenChange={setIsPopoverOpen}
                tooltip="Revert changes"
              >
                <PiArrowCounterClockwiseBold />
              </ActionButton>
            )}
            {model.showCommitButton && (
              <ActionButton
                content={
                  <CreateRevisionContent onClick={model.handleCommitChanges} onClose={() => setIsPopoverOpen(false)} />
                }
                onOpenChange={setIsPopoverOpen}
                tooltip="Commit changes"
              >
                <PiCheckBold />
              </ActionButton>
            )}
          </Flex>
        )}
      </Flex>
    </Flex>
  )
})
