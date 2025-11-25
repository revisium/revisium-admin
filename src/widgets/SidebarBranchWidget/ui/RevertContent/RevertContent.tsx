import { Flex, Link, Popover } from '@chakra-ui/react'
import { FC, useCallback, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { GrayButton } from 'src/shared/ui/GreyButton/GrayButton.tsx'

interface RevertContentProps {
  onClick: () => void | Promise<void>
  onClose: () => void
  changesLink: string
}

export const RevertContent: FC<RevertContentProps> = ({ onClick, onClose, changesLink }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = useCallback(async () => {
    setIsLoading(true)
    try {
      await onClick()
      onClose()
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }, [onClick, onClose])

  return (
    <Popover.Content width="240px">
      <Popover.Header fontWeight="500" fontSize="14px" color="newGray.500" borderBottom="0" pb="0">
        Revert all changes?
      </Popover.Header>
      <Popover.CloseTrigger color="newGray.300" />
      <Popover.Body pt="0.5rem" pb="1rem">
        <Flex flexDirection="column" gap="0.75rem">
          <Link asChild colorPalette="gray" focusRing="none" fontSize="12px" color="newGray.400">
            <RouterLink to={changesLink} onClick={onClose}>
              Review changes before reverting
            </RouterLink>
          </Link>
          <Flex justifyContent="flex-end">
            <GrayButton isLoading={isLoading} onClick={handleClick} title="Revert" />
          </Flex>
        </Flex>
      </Popover.Body>
    </Popover.Content>
  )
}
