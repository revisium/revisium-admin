import { IconButton } from '@chakra-ui/react'
import { FC, useCallback, useState } from 'react'
import { PiGearThin } from 'react-icons/pi'

interface SettingsButtonProps {
  onClick?: () => Promise<unknown> | void
  color?: string
  dataTestId?: string
}

export const SettingsButton: FC<SettingsButtonProps> = ({ onClick, color, dataTestId }) => {
  const [loading, setLoading] = useState(false)

  const handleClick = useCallback(async () => {
    setLoading(true)
    await onClick?.()
    setLoading(false)
  }, [onClick])

  return (
    <IconButton
      _hover={{ backgroundColor: 'gray.100' }}
      data-testid={dataTestId}
      aria-label=""
      color={color || 'gray.400'}
      loading={loading}
      variant="ghost"
      onClick={handleClick}
    >
      <PiGearThin />
    </IconButton>
  )
}
