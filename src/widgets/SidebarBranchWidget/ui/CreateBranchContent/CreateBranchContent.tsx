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
      // await onClick(name)
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
    <Popover.Content>
      <Popover.CloseTrigger color="gray.400" />
      <Popover.Body>
        <Flex alignSelf="flex-start" gap="0.5rem">
          <Input
            ref={ref}
            data-testid="create-branch-name-input"
            borderColor="gray.100"
            borderStyle="solid"
            borderWidth="1px"
            padding="0 0.5rem"
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
