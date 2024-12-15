import { DeleteIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'
import { FC, useCallback, useState } from 'react'

interface RemoveRowButtonProps {
  rowId: string
  onRemove?: (rowId: string) => Promise<boolean>
  dataTestId?: string
}

export const RemoveRowButton: FC<RemoveRowButtonProps> = ({ rowId, onRemove, dataTestId }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = useCallback(async () => {
    setIsLoading(true)
    await onRemove?.(rowId)
    setIsLoading(false)
  }, [rowId, onRemove])

  return (
    <IconButton
      data-testid={dataTestId}
      aria-label=""
      color="gray.400"
      icon={<DeleteIcon />}
      isLoading={isLoading}
      variant="ghost"
      onClick={handleClick}
    />
  )
}