import { Flex, Link, Textarea, Popover } from '@chakra-ui/react'
import React, { FC, useCallback, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { GrayButton } from 'src/shared/ui/GreyButton/GrayButton.tsx'

interface CreateRevisionContentProps {
  onClick: (comment: string) => Promise<void>
  onClose: () => void
  changesLink: string
}

export const CreateRevisionContent: FC<CreateRevisionContentProps> = ({ onClick, onClose, changesLink }) => {
  const [comment, setComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = useCallback(async () => {
    setIsLoading(true)
    try {
      await onClick(comment)
      onClose()
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }, [comment, onClick, onClose])

  const handleComment: React.ChangeEventHandler<HTMLTextAreaElement> = useCallback((event) => {
    setComment(event.currentTarget.value)
  }, [])

  return (
    <Popover.Content width="280px">
      <Popover.Body pt="0.75rem" pb="1rem">
        <Flex flexDirection="column" gap="0.75rem">
          <Textarea
            size="sm"
            fontSize="13px"
            rows={3}
            resize="none"
            borderColor="newGray.100"
            _placeholder={{ color: 'newGray.300' }}
            placeholder="Comment (optional)"
            onChange={handleComment}
          />
          <Flex width="100%" justifyContent="space-between" alignItems="center">
            <Link asChild colorPalette="gray" focusRing="none" fontSize="12px" color="newGray.400">
              <RouterLink to={changesLink} onClick={onClose}>
                Review changes
              </RouterLink>
            </Link>
            <GrayButton isLoading={isLoading} onClick={handleClick} title="Commit" />
          </Flex>
        </Flex>
      </Popover.Body>
    </Popover.Content>
  )
}
