import { Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { PiArrowCounterClockwiseBold, PiCheckBold, PiPlusBold } from 'react-icons/pi'
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

  const [openedPopover, setOpenedPopover] = useState<null | 'create' | 'commit' | 'revert'>(null)

  if (model.isLoading) {
    return null
  }

  return (
    <Flex
      alignItems="center"
      backgroundColor={openedPopover ? 'gray.900/4' : 'transparent'}
      _hover={{ backgroundColor: 'newGray.100' }}
      borderRadius="0.25rem"
      height="30px"
      paddingLeft="0.5rem"
      paddingRight="0.5rem"
      width="100%"
      className="group"
    >
      <Flex width="100%" alignItems="center" justifyContent="space-between">
        <BranchButton
          model={model}
          onAction={async () => {}}
          onOpenChange={(open) => setOpenedPopover(open ? null : openedPopover)}
        />
        {model.showActionsButton && (
          <Flex
            pl="16px"
            gap="8px"
            display="flex"
            opacity={openedPopover ? 1 : 0}
            pointerEvents={openedPopover ? 'auto' : 'none'}
            _groupHover={{ opacity: 1, pointerEvents: 'auto' }}
          >
            {model.showBranchButton && (
              <ActionButton
                open={openedPopover === 'create'}
                onOpenChange={(open) => setOpenedPopover(open ? 'create' : null)}
                content={
                  <CreateBranchContent onClick={model.handleCreateBranch} onClose={() => setOpenedPopover(null)} />
                }
                tooltip="Create branch"
              >
                <PiPlusBold />
              </ActionButton>
            )}
            {model.showRevertButton && (
              <ActionButton
                open={openedPopover === 'revert'}
                onOpenChange={(open) => setOpenedPopover(open ? 'revert' : null)}
                content={<RevertContent onClick={model.handleRevertChanges} onClose={() => setOpenedPopover(null)} />}
                tooltip="Revert changes"
              >
                <PiArrowCounterClockwiseBold />
              </ActionButton>
            )}
            {model.showCommitButton && (
              <ActionButton
                open={openedPopover === 'commit'}
                onOpenChange={(open) => setOpenedPopover(open ? 'commit' : null)}
                content={
                  <CreateRevisionContent onClick={model.handleCommitChanges} onClose={() => setOpenedPopover(null)} />
                }
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
