import { IconButtonProps } from '@chakra-ui/react'
import { IconButton } from '@chakra-ui/react'
import { FC } from 'react'
import { PiDotsThreeVerticalBold } from 'react-icons/pi'

interface DotsThreeButtonProps extends IconButtonProps {
  dataTestId?: string
}

export const DotsThreeButton: FC<DotsThreeButtonProps> = ({ dataTestId, ...props }) => {
  return (
    <IconButton
      data-testid={dataTestId}
      _hover={{ backgroundColor: 'gray.100' }}
      color="gray.400"
      variant="ghost"
      size="lg"
      width="40px"
      height="40px"
      {...props}
    >
      <PiDotsThreeVerticalBold />
    </IconButton>
  )
}
