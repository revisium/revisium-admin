import { PiCheckThin } from 'react-icons/pi'
import { Flex, IconButton, Textarea, useDisclosure } from '@chakra-ui/react'
import { Popover } from '@chakra-ui/react/popover'
import React, { useCallback, useState } from 'react'
import { GrayButton } from 'src/shared/ui/GreyButton/GrayButton.tsx'

interface CreateRevisionButtonProps {
  onClick?: (comment: string) => Promise<void>
}

export const CreateRevisionButton: React.FC<CreateRevisionButtonProps> = ({ onClick }) => {
  const [comment, setComment] = useState('')
  const { onOpen, onClose, open } = useDisclosure()

  const [isLoading, setIsLoading] = useState(false)

  const handleClick = useCallback(async () => {
    setIsLoading(true)
    await onClick?.(comment)
    setIsLoading(false)
  }, [comment, onClick])

  const handleComment: React.ChangeEventHandler<HTMLTextAreaElement> = useCallback((event) => {
    setComment(event.currentTarget.value)
  }, [])

  return (
    <Popover.Root open={open} onOpenChange={({ open }) => (open ? onOpen() : onClose())}>
      <Popover.Trigger asChild>
        <IconButton
          data-testid="create-revision-button"
          _hover={{ backgroundColor: 'gray.50' }}
          loading={isLoading}
          aria-label=""
          variant="ghost"
          color="gray.300"
        >
          <PiCheckThin size={12} />
        </IconButton>
      </Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content>
          <Popover.Arrow />
          <Popover.CloseTrigger color="gray.400" />
          <Popover.Body p="1rem 2rem 1rem 1rem">
            <Flex flexDirection="column" alignItems="end" justifyContent="flex-start" gap="0.5rem">
              <Textarea
                _placeholder={{ color: 'gray.300' }}
                placeholder="Comment (optional)"
                onChange={handleComment}
              />
              <div>
                <GrayButton onClick={handleClick} title="Commit"></GrayButton>
              </div>
            </Flex>
          </Popover.Body>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  )
}
