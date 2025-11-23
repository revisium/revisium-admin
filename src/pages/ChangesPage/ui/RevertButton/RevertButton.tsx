import { Button, Popover, Portal, ButtonGroup } from '@chakra-ui/react'
import { FC, useCallback, useState } from 'react'
import { PiArrowCounterClockwiseBold } from 'react-icons/pi'
import { GrayButton } from 'src/shared/ui/GreyButton/GrayButton'

interface RevertButtonProps {
  onClick: () => void | Promise<void>
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export const RevertButton: FC<RevertButtonProps> = ({ onClick, isOpen, onOpenChange }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = useCallback(async () => {
    setIsLoading(true)
    try {
      await onClick()
      onOpenChange(false)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }, [onClick, onOpenChange])

  return (
    <Popover.Root portalled open={isOpen} onOpenChange={(e) => onOpenChange(e.open)}>
      <Popover.Trigger asChild>
        <Button size="sm" variant="ghost" color="gray" focusRing="none">
          <PiArrowCounterClockwiseBold />
          Revert
        </Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content width="200px">
            <Popover.Header color="gray.500">Revert all changes?</Popover.Header>
            <Popover.Footer width="100%" border="0" display="flex" justifyContent="flex-end">
              <ButtonGroup>
                <GrayButton isLoading={isLoading} onClick={handleClick} title="Revert" />
              </ButtonGroup>
            </Popover.Footer>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
}
