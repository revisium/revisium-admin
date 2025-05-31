import React from 'react'
import { PiPlusBold } from 'react-icons/pi'
import { GrayButton } from 'src/shared/ui/GreyButton/GrayButton.tsx'

interface CreateButtonProps {
  title: string
  onClick?: () => void
  disabled?: boolean
  height?: string
  dataTestId?: string
}

export const CreateButton: React.FC<CreateButtonProps> = (props) => {
  return <GrayButton {...props} icon={<PiPlusBold />}></GrayButton>
}
