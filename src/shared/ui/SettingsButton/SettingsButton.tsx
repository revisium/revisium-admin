import { IconButton, IconButtonProps } from '@chakra-ui/react'
import { FC } from 'react'
import { PiGear } from 'react-icons/pi'

interface SettingsButtonProps extends IconButtonProps {
  dataTestId?: string
}

export const SettingsButton: FC<SettingsButtonProps> = ({ dataTestId, ...props }) => {
  return (
    <IconButton
      data-testid={dataTestId}
      _hover={{ backgroundColor: 'gray.50' }}
      color="gray.400"
      variant="ghost"
      size="sm"
      {...props}
    >
      <PiGear />
    </IconButton>
  )
}
