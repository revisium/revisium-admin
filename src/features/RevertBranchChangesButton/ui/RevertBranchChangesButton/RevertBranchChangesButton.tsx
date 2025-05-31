import {
  ButtonGroup,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react'
import { Popover } from '@chakra-ui/react/popover'
import React, { useCallback, useState } from 'react'
import { PiArrowCounterClockwiseBold } from 'react-icons/pi'
import { GrayButton } from 'src/shared/ui/GreyButton/GrayButton.tsx'

interface RevertBranchChangesButtonProps {
  onClick: () => Promise<void>
}

export const RevertBranchChangesButton: React.FC<RevertBranchChangesButtonProps> = ({ onClick }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { onOpen, onClose, open } = useDisclosure()

  const handleClick = useCallback(async () => {
    setIsLoading(true)
    onClose()
    await onClick?.()
    setIsLoading(false)
  }, [onClick, onClose])

  return (
    <Popover.Root open={open} onOpenChange={({ open }) => open ? onOpen() : onClose()}>
      <Popover.Trigger asChild>
        <IconButton
          data-testid="revert-revision-button"
          _hover={{ backgroundColor: 'gray.50' }}
          loading={isLoading}
          aria-label=""
          variant="ghost"
          color="gray.300"
        >
          <PiArrowCounterClockwiseBold size="16" />
        </IconButton>
      </Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content width="200px">
          <Popover.Arrow />
          <Popover.CloseTrigger color="gray.400" />
          <Popover.Header color="gray.500">Revert all changes?</Popover.Header>
          <Popover.Footer width="100%" border="0" display="flex" justifyContent="flex-end">
            <ButtonGroup>
              <GrayButton onClick={handleClick} title="Revert"></GrayButton>
            </ButtonGroup>
          </Popover.Footer>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  )
}
