import { Box, Flex, Popover, Portal, useDisclosure } from '@chakra-ui/react'
import { FC, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { PiArrowCounterClockwiseBold, PiCheckBold, PiPlusBold } from 'react-icons/pi'
import { useViewModel } from 'src/shared/lib'
import { BranchRevisionContent } from 'src/widgets/BranchRevisionContent'
import { SidebarBranchWidgetModel } from 'src/widgets/SidebarBranchWidget/model/SidebarBranchWidgetModel.ts'
import { ActionButton } from 'src/widgets/SidebarBranchWidget/ui/ActionButton/ActionButton.tsx'
import { CreateRevisionContent } from 'src/widgets/SidebarBranchWidget/ui/CreateRevisionContent/CreateRevisionContent.tsx'
import { RevertContent } from 'src/widgets/SidebarBranchWidget/ui/RevertContent/RevertContent.tsx'
import { CreateBranchContent } from 'src/widgets/SidebarBranchWidget/ui/CreateBranchContent/CreateBranchContent.tsx'
import { Tooltip } from 'src/shared/ui'

export const BranchWidget: FC = observer(() => {
  const model = useViewModel(SidebarBranchWidgetModel)

  const { onOpen, onClose, open } = useDisclosure()
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const [openedPopover, setOpenedPopover] = useState<null | 'create' | 'commit' | 'revert'>(null)

  return (
    <Flex width="100%" alignItems="center" justifyContent="space-between">
      <Popover.Root
        lazyMount
        unmountOnExit
        portalled
        open={open}
        onOpenChange={({ open }) => {
          if (open) {
            onOpen()
          } else {
            onClose()
          }
        }}
      >
        <Tooltip
          open={!open && tooltipOpen}
          onOpenChange={(details) => {
            setTooltipOpen(details.open)
          }}
          content="Select branch or revision"
          openDelay={500}
          closeDelay={50}
        >
          <Flex minWidth={0} width="100%">
            <Popover.Trigger asChild>
              <Flex
                color="newGray.500"
                _hover={{ color: 'newGray.600' }}
                fontWeight="500"
                textDecoration="none"
                fontSize="14px"
                alignItems="center"
                minWidth="0"
                cursor="pointer"
              >
                <Flex gap="4px" alignItems="center" minWidth="0">
                  <Box textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
                    {model.name}
                  </Box>
                </Flex>
                <Box color="newGray.300" flexShrink="0">
                  {model.postfix}
                </Box>
                {model.touched && <Box flexShrink="0">*</Box>}
              </Flex>
            </Popover.Trigger>
          </Flex>
        </Tooltip>
        <Portal>
          <Popover.Positioner>
            <Popover.Content>
              <Popover.CloseTrigger />
              <Popover.Body>
                <Popover.Title />
                <BranchRevisionContent />
              </Popover.Body>
            </Popover.Content>
          </Popover.Positioner>
        </Portal>
      </Popover.Root>

      {model.showActionsButton && (
        <Flex
          pl="16px"
          gap="8px"
          display={openedPopover ? 'flex' : 'none'}
          pointerEvents={openedPopover ? 'auto' : 'none'}
          _groupHover={{ display: 'flex', pointerEvents: 'auto' }}
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
              content={
                <RevertContent
                  onClick={model.handleRevertChanges}
                  onClose={() => setOpenedPopover(null)}
                  changesLink={model.changesLink}
                />
              }
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
                <CreateRevisionContent
                  onClick={model.handleCommitChanges}
                  onClose={() => setOpenedPopover(null)}
                  changesLink={model.changesLink}
                />
              }
              tooltip="Commit changes"
            >
              <PiCheckBold />
            </ActionButton>
          )}
        </Flex>
      )}
    </Flex>
  )
})
