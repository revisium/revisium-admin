import { Flex, Popover, Portal, useDisclosure } from '@chakra-ui/react'
import { FC } from 'react'
import { observer } from 'mobx-react-lite'
import { BranchRevisionContent } from 'src/widgets/BranchRevisionContent'
import { SidebarBranchWidgetModel } from 'src/widgets/SidebarBranchWidget/model/SidebarBranchWidgetModel.ts'
import { BranchTrigger } from 'src/widgets/SidebarBranchWidget/ui/BranchesMenu/BranchTrigger.tsx'
import { Tooltip } from 'src/shared/ui'

interface BranchesMenuProps {
  model: SidebarBranchWidgetModel
  onOpenChange?: (open: boolean) => void
}

export const BranchButton: FC<BranchesMenuProps> = observer(({ model, onOpenChange }) => {
  const { onOpen, onClose, open } = useDisclosure()

  return (
    <Popover.Root
      lazyMount
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
          <Flex minWidth={0} width="100%">
            <BranchTrigger name={model.name} postfix={model.postfix} touched={model.touched} />
          </Flex>
        </Tooltip>
      )}
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.CloseTrigger />
            <Popover.Body>
              <Popover.Title />
              <BranchRevisionContent onClose={onClose} />
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
})
