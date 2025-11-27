import { Flex, IconButton, Popover, Portal } from '@chakra-ui/react'
import { FC, useState, useCallback } from 'react'
import { PiTrashLight } from 'react-icons/pi'
import { GrayButton } from 'src/shared/ui/GreyButton/GrayButton'

interface DeleteButtonProps {
  onDelete: () => Promise<void>
}

export const DeleteButton: FC<DeleteButtonProps> = ({ onDelete }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = useCallback(async () => {
    setIsLoading(true)
    try {
      await onDelete()
      setIsOpen(false)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }, [onDelete])

  return (
    <Popover.Root portalled open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
      <Popover.Trigger asChild>
        <IconButton
          aria-label="Delete endpoint"
          size="sm"
          variant="plain"
          color="newGray.400"
          opacity={0}
          _groupHover={{ opacity: 1 }}
        >
          <PiTrashLight />
        </IconButton>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content width="200px">
            <Popover.Header color="gray.500" borderBottom="0" pb="0">
              Delete endpoint?
            </Popover.Header>
            <Popover.Body pt="0.5rem" pb="1rem">
              <Flex justifyContent="flex-end">
                <GrayButton isLoading={isLoading} onClick={handleDelete} title="Delete" />
              </Flex>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
}
