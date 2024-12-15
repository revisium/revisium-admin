import { DeleteIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useState } from 'react'

import { useDeleteProjectStore } from 'src/features/DeleteProjectButton/hooks/useDeleteProjectStore.ts'

interface RemoveTableButtonProps {
  organizationId: string
  projectName: string
}

export const DeleteProjectButton: FC<RemoveTableButtonProps> = observer(({ organizationId, projectName }) => {
  const store = useDeleteProjectStore()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = useCallback(async () => {
    setIsLoading(true)
    await store.delete(organizationId, projectName)
    setIsLoading(false)
  }, [store, organizationId, projectName])

  return (
    <IconButton
      data-testid={`remove-project-${projectName}-button`}
      _hover={{ backgroundColor: 'gray.100' }}
      aria-label="removeTable"
      color="gray.400"
      icon={<DeleteIcon />}
      isLoading={isLoading}
      variant="ghost"
      onClick={handleClick}
    />
  )
})
