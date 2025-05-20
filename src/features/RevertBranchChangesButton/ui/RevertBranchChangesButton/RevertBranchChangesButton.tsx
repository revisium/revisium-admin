import {
  ButtonGroup,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  useDisclosure,
} from '@chakra-ui/react'
import React, { useCallback, useState } from 'react'
import { PiArrowCounterClockwiseBold } from 'react-icons/pi'
import { GrayButton } from 'src/shared/ui/GreyButton/GrayButton.tsx'

interface RevertBranchChangesButtonProps {
  onClick: () => Promise<void>
}

export const RevertBranchChangesButton: React.FC<RevertBranchChangesButtonProps> = ({ onClick }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { onOpen, onClose, isOpen } = useDisclosure()

  const handleClick = useCallback(async () => {
    setIsLoading(true)
    onClose()
    await onClick?.()
    setIsLoading(false)
  }, [onClick, onClose])

  return (
    <Popover isLazy isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <PopoverTrigger>
        <IconButton
          data-testid="revert-revision-button"
          _hover={{ backgroundColor: 'gray.50' }}
          isLoading={isLoading}
          aria-label=""
          icon={<PiArrowCounterClockwiseBold size="16" />}
          variant="ghost"
          color="gray.300"
        />
      </PopoverTrigger>
      <PopoverContent width="200px">
        <PopoverArrow />
        <PopoverCloseButton color="gray.400" />
        <PopoverHeader color="gray.500">Revert all changes?</PopoverHeader>
        <PopoverFooter width="100%" border="0" display="flex" justifyContent="flex-end">
          <ButtonGroup>
            <GrayButton onClick={handleClick} title="Revert"></GrayButton>
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  )
}
