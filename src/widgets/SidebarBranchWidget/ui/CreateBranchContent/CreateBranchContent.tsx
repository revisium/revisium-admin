import { Flex, Input, Popover } from '@chakra-ui/react'
import React, { useCallback, useRef, useState } from 'react'
import { ApproveButton } from 'src/shared/ui'

interface CreateBranchContentProps {
  onClick: (name: string) => Promise<void>
  onClose: () => void
}

export const CreateBranchContent: React.FC<CreateBranchContentProps> = ({ onClick, onClose }) => {
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const ref = useRef<HTMLInputElement | null>(null)

  const handleAdd = useCallback(async () => {
    setIsLoading(true)
    try {
      await onClick(name)
      onClose()
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }, [name, onClick, onClose])

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    setName(event.currentTarget.value)
  }, [])

  return (
    <Popover.Content width="280px">
      <Popover.Header fontWeight="500" fontSize="14px" color="newGray.500" borderBottom="0" pb="0">
        Create branch
      </Popover.Header>
      <Popover.CloseTrigger color="newGray.300" />
      <Popover.Body pt="0.75rem" pb="1rem">
        <Flex gap="0.5rem">
          <Input
            ref={ref}
            data-testid="create-branch-name-input"
            size="sm"
            fontSize="13px"
            borderColor="newGray.100"
            _placeholder={{ color: 'newGray.300' }}
            placeholder="branch-name"
            variant="outline"
            onChange={handleChange}
            onKeyDown={async (e) => {
              if (e.key === 'Enter') {
                await handleAdd()
              }
            }}
          />
          <ApproveButton
            dataTestId="create-branch-approve-button"
            isDisabled={!name}
            loading={isLoading}
            onClick={handleAdd}
          />
        </Flex>
      </Popover.Body>
    </Popover.Content>
  )
}
