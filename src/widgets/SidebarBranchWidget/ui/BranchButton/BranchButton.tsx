import { Box, Flex, Popover, Portal, useDisclosure } from '@chakra-ui/react'
import { FC, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { PiCaretDownBold, PiCaretRightBold, PiGitBranchLight } from 'react-icons/pi'
import { BranchRevisionContent } from 'src/widgets/BranchRevisionContent'
import { SidebarBranchWidgetModel } from 'src/widgets/SidebarBranchWidget/model/SidebarBranchWidgetModel.ts'
import { Tooltip } from 'src/shared/ui'

interface BranchesMenuProps {
  model: SidebarBranchWidgetModel
  onOpenChange?: (open: boolean) => void
  isExpanded: boolean
  onCollapseClick: () => void
}

export const BranchButton: FC<BranchesMenuProps> = observer(({ model, onOpenChange, isExpanded, onCollapseClick }) => {
  const { onOpen, onClose, open } = useDisclosure()
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const handleIconClick = (e: React.MouseEvent) => {
    if (onCollapseClick) {
      e.stopPropagation()
      onCollapseClick()
    }
  }

  return (
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
        onOpenChange?.(open)
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
                <Box color="newGray.400" onClick={handleIconClick} cursor="pointer">
                  <Box as={PiGitBranchLight} display="block" _groupHover={{ display: 'none' }} />
                  <Box
                    as={isExpanded ? PiCaretDownBold : PiCaretRightBold}
                    display="none"
                    _groupHover={{ display: 'block' }}
                  />
                </Box>
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
  )
})
