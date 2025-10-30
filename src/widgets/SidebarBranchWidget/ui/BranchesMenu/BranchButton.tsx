import { Box, Popover, Portal, useDisclosure } from '@chakra-ui/react'
import { FC } from 'react'
import { observer } from 'mobx-react-lite'
import { SidebarBranchWidgetModel } from 'src/widgets/SidebarBranchWidget/model/SidebarBranchWidgetModel.ts'
import { BranchRevisionContent } from 'src/widgets/SidebarBranchWidget/ui/BranchRevisionContent/BranchRevisionContent.tsx'
import { BranchTrigger } from 'src/widgets/SidebarBranchWidget/ui/BranchesMenu/BranchTrigger.tsx'
import { Tooltip } from 'src/shared/ui'

interface BranchesMenuProps {
  model: SidebarBranchWidgetModel
  onAction: () => Promise<void>
  onOpenChange?: (open: boolean) => void
}

export const BranchButton: FC<BranchesMenuProps> = observer(({ model, onOpenChange }) => {
  const { onOpen, onClose, open } = useDisclosure()

  // const handleClick = useCallback(async () => {
  //   onClose()
  //   await onAction()
  // }, [onAction, onClose])

  return (
    <Popover.Root
      portalled
      open={open}
      onOpenChange={({ open }) => {
        if (open) {
          onOpen()
        } else {
          onClose()
        }
        onOpenChange?.(open)
      }}
    >
      {open ? (
        <BranchTrigger name={model.name} postfix={model.postfix} touched={model.touched} />
      ) : (
        <Tooltip content="Select branch or revision" openDelay={500} closeDelay={50}>
          <Box>
            <BranchTrigger name={model.name} postfix={model.postfix} touched={model.touched} />
          </Box>
        </Tooltip>
      )}
      <Portal>
        <Popover.Positioner>
          <Popover.Content zIndex={2000}>
            <Popover.CloseTrigger />
            <Popover.Body>
              <Popover.Title />
              <BranchRevisionContent />
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
})
