import { IconButton, IconButtonProps } from '@chakra-ui/react'
import { FC } from 'react'
import { PiGear } from 'react-icons/pi'

interface ProjectSettingsButtonProps extends IconButtonProps {
  dataTestId?: string
}

export const ProjectSettingsButton: FC<ProjectSettingsButtonProps> = ({ onClick, color, dataTestId }) => {
  return (
    <IconButton
      _hover={{ backgroundColor: 'gray.100' }}
      data-testid={dataTestId}
      aria-label=""
      color={color || 'gray.400'}
      variant="ghost"
      onClick={onClick}
    >
      <PiGear />
    </IconButton>
  )
}
