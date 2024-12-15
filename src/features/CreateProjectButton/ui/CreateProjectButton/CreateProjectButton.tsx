import React from 'react'
import { CreateButton } from 'src/shared/ui'

interface CreateProjectButtonProps {
  onClick: () => void
}

export const CreateProjectButton: React.FC<CreateProjectButtonProps> = ({ onClick }) => {
  return <CreateButton dataTestId="create-project-button" title="Project" onClick={onClick} />
}
