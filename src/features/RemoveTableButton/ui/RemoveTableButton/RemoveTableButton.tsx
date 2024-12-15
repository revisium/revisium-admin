import { DeleteIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'
import { FC, useCallback, useState } from 'react'

interface RemoveTableButtonProps {
  onRemove?: () => Promise<boolean>
  dataTestId?: string
}

export const RemoveTableButton: FC<RemoveTableButtonProps> = ({ onRemove, dataTestId }) => {
  const [loading, setLoading] = useState(false)

  const handleClick = useCallback(async () => {
    setLoading(true)
    await onRemove?.()
    setLoading(false)
  }, [onRemove])

  return (
    <IconButton
      data-testid={dataTestId}
      _hover={{ backgroundColor: 'gray.100' }}
      aria-label=""
      color="gray.400"
      icon={<DeleteIcon />}
      isLoading={loading}
      variant="ghost"
      onClick={handleClick}
    />
  )
}
