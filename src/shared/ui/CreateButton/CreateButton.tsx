import { AddIcon } from '@chakra-ui/icons'
import React from 'react'
import { GrayButton } from 'src/shared/ui/GreyButton/GrayButton.tsx'

interface CreateButtonProps {
  title: string
  onClick?: () => void
  isDisabled?: boolean
  height?: string
  dataTestId?: string
}

export const CreateButton: React.FC<CreateButtonProps> = (props) => {
  return <GrayButton {...props} icon={<AddIcon boxSize={3} />}></GrayButton>
}
