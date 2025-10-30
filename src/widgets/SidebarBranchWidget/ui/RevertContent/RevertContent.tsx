import { ButtonGroup, Popover } from '@chakra-ui/react'
import { FC, useCallback, useState } from 'react'
import { GrayButton } from 'src/shared/ui/GreyButton/GrayButton.tsx'

interface RevertContentProps {
  onClick: () => void | Promise<void>
  onClose: () => void
}

export const RevertContent: FC<RevertContentProps> = ({ onClick, onClose }) => {
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
    <Popover.Content width="200px">
      <Popover.Header color="gray.500">Revert all changes?</Popover.Header>
      <Popover.Footer width="100%" border="0" display="flex" justifyContent="flex-end">
        <ButtonGroup>
          <GrayButton isLoading={isLoading} onClick={handleClick} title="Revert"></GrayButton>
        </ButtonGroup>
      </Popover.Footer>
    </Popover.Content>
  )
}
