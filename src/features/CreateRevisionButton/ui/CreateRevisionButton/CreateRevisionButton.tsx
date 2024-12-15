import { CheckIcon } from '@chakra-ui/icons'
import {
  Flex,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react'
import React, { useCallback, useState } from 'react'
import { GrayButton } from 'src/shared/ui/GreyButton/GrayButton.tsx'

interface CreateRevisionButtonProps {
  onClick?: (comment: string) => Promise<void>
}

export const CreateRevisionButton: React.FC<CreateRevisionButtonProps> = ({ onClick }) => {
  const [comment, setComment] = useState('')
  const { onOpen, onClose, isOpen } = useDisclosure()

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
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <PopoverTrigger>
        <IconButton
          data-testid="create-revision-button"
          _hover={{ backgroundColor: 'gray.50' }}
          isLoading={isLoading}
          aria-label=""
          icon={<CheckIcon boxSize={3} />}
          variant="ghost"
          color="gray.300"
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody p="1rem">
          <Flex flexDirection="column" alignItems="end" justifyContent="flex-start" gap="0.5rem">
            <Textarea _placeholder={{ color: 'gray.300' }} placeholder="Comment (optional)" onChange={handleComment} />
            <div>
              <GrayButton onClick={handleClick} title="Commit"></GrayButton>
            </div>
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
