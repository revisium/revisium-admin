import { IconButton } from '@chakra-ui/react'
import React, { useCallback, useState } from 'react'
import { PiArrowCounterClockwiseBold } from 'react-icons/pi'

interface RevertBranchChangesButtonProps {
  onClick: () => Promise<void>
}

export const RevertBranchChangesButton: React.FC<RevertBranchChangesButtonProps> = ({ onClick }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = useCallback(async () => {
    setIsLoading(true)
    await onClick?.()
    setIsLoading(false)
  }, [onClick])

  return (
    <IconButton
      data-testid="revert-revision-button"
      _hover={{ backgroundColor: 'gray.50' }}
      isLoading={isLoading}
      aria-label=""
      icon={<PiArrowCounterClockwiseBold size="16" />}
      variant="ghost"
      onClick={handleClick}
      color="gray.300"
    />
  )
}
