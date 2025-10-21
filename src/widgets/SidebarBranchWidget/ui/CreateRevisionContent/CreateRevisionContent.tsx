import { Flex, Textarea, Popover } from '@chakra-ui/react'
import React, { FC, useCallback, useState } from 'react'
import { GrayButton } from 'src/shared/ui/GreyButton/GrayButton.tsx'

interface CreateRevisionContentProps {
  onClick: (comment: string) => Promise<void>
  onClose?: () => void
}

export const CreateRevisionContent: FC<CreateRevisionContentProps> = ({ onClick, onClose }) => {
  const [comment, setComment] = useState('')

  const handleClick = useCallback(async () => {
    await onClick(comment)
    onClose?.()
  }, [comment, onClick, onClose])

  const handleComment: React.ChangeEventHandler<HTMLTextAreaElement> = useCallback((event) => {
    setComment(event.currentTarget.value)
  }, [])

  return (
    <Popover.Content>
      <Popover.CloseTrigger color="gray.400" />
      <Popover.Body p="1rem 2rem 1rem 1rem">
        <Flex flexDirection="column" alignItems="end" justifyContent="flex-start" gap="0.5rem">
          <Textarea _placeholder={{ color: 'gray.300' }} placeholder="Comment (optional)" onChange={handleComment} />
          <div>
            <GrayButton onClick={handleClick} title="Commit"></GrayButton>
          </div>
        </Flex>
      </Popover.Body>
    </Popover.Content>
  )
}
