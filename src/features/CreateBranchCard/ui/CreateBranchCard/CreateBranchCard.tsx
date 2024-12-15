import { Flex, Input } from '@chakra-ui/react'
import React, { useCallback, useState } from 'react'

import { useInputAutofocus } from 'src/shared/lib'
import { ApproveButton, CloseButton } from 'src/shared/ui'

interface CreateBranchCardProps {
  onAdd?: (branchName: string) => Promise<void>
  onCancel?: () => void
}

export const CreateBranchCard: React.FC<CreateBranchCardProps> = ({ onCancel, onAdd }) => {
  const [loading, setLoading] = useState(false)

  const autofocusRef = useInputAutofocus()

  const [name, setName] = useState('')

  const handleAdd = useCallback(async () => {
    setLoading(true)
    await onAdd?.(name)
    setLoading(false)
  }, [name, onAdd])

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    setName(event.currentTarget.value)
  }, [])

  return (
    <Flex alignSelf="flex-start" gap="0.5rem">
      <Input
        data-testid="create-branch-name-input"
        borderColor="gray.100"
        borderStyle="solid"
        borderWidth="1px"
        padding="0 0.5rem"
        placeholder="branch-name"
        ref={autofocusRef}
        variant="unstyled"
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleAdd()
          }
        }}
      />
      <CloseButton dataTestId="create-branch-close-button" onClick={onCancel} />
      <ApproveButton
        dataTestId="create-branch-approve-button"
        isDisabled={!name}
        loading={loading}
        onClick={handleAdd}
      />
    </Flex>
  )
}
