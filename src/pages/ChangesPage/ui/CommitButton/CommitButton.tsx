import { Button, Popover, Portal, Flex, Textarea } from '@chakra-ui/react'
import { FC, useCallback, useState } from 'react'
import { PiCheckBold } from 'react-icons/pi'
import { GrayButton } from 'src/shared/ui/GreyButton/GrayButton'

interface CommitButtonProps {
  onClick: (comment: string) => Promise<void>
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export const CommitButton: FC<CommitButtonProps> = ({ onClick, isOpen, onOpenChange }) => {
  const [comment, setComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = useCallback(async () => {
    setIsLoading(true)
    try {
      await onClick(comment)
      onOpenChange(false)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }, [comment, onClick, onOpenChange])

  const handleComment: React.ChangeEventHandler<HTMLTextAreaElement> = useCallback((event) => {
    setComment(event.currentTarget.value)
  }, [])

  return (
    <Popover.Root portalled open={isOpen} onOpenChange={(e) => onOpenChange(e.open)}>
      <Popover.Trigger asChild>
        <Button size="sm" variant="ghost" color="gray" focusRing="none">
          <PiCheckBold />
          Commit
        </Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.CloseTrigger color="gray.400" />
            <Popover.Body p="1rem 2rem 1rem 1rem">
              <Flex flexDirection="column" alignItems="end" justifyContent="flex-start" gap="0.5rem">
                <Textarea
                  _placeholder={{ color: 'gray.300' }}
                  placeholder="Comment (optional)"
                  onChange={handleComment}
                />
                <div>
                  <GrayButton isLoading={isLoading} onClick={handleClick} title="Commit" />
                </div>
              </Flex>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
}
