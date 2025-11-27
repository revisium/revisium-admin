import { Box, Flex, Popover, Portal } from '@chakra-ui/react'
import { FC, ReactNode } from 'react'
import { Tooltip } from 'src/shared/ui'

interface ActionButtonProps {
  children: ReactNode
  content: ReactNode
  onOpenChange: (open: boolean) => void
  tooltip?: ReactNode
  open: boolean
}

export const ActionButton: FC<ActionButtonProps> = ({ content, children, onOpenChange, tooltip, open }) => {
  return (
    <Popover.Root portalled open={open} onOpenChange={({ open }) => onOpenChange(open)}>
      <Popover.Trigger asChild>
        <Flex
          justifyContent="center"
          alignItems="center"
          width="24px"
          height="24px"
          fontSize="16px"
          cursor="pointer"
          color="newGray.400"
          _hover={{ color: 'newGray.500' }}
        >
          {tooltip && !open ? (
            <Tooltip content={tooltip} openDelay={500} closeDelay={0}>
              <Box as="span" display="flex" alignItems="center">
                {children}
              </Box>
            </Tooltip>
          ) : (
            children
          )}
        </Flex>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>{content}</Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
}
