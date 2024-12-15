import { Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useState } from 'react'

import { useCreateProjectStore } from 'src/features/CreateProjectCard/hooks/useCreateProjectModel.ts'
import { SettingsButton } from 'src/features/SettingsButton/ui/SettingsButton/SettingsButton.tsx'
import { ApproveButton, CardInput, CloseButton } from 'src/shared/ui'

interface CreateProjectCardProps {
  onAdd?: () => void
  onCancel?: () => void
}

export const CreateProjectCard: React.FC<CreateProjectCardProps> = observer(({ onCancel, onAdd }) => {
  const store = useCreateProjectStore()
  const [isLoading, setIsLoading] = useState(false)

  const handleAdd = useCallback(async () => {
    setIsLoading(true)
    await store.create()
    setIsLoading(false)
    onAdd?.()
  }, [onAdd, store])

  const handleChangeName: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      store.setProjectName(event.currentTarget.value)
    },
    [store],
  )

  const handleChangeBranchName: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      store.setBranchName(event.currentTarget.value)
    },
    [store],
  )

  const handleChangeFromRevisionId: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      store.setFromRevisionId(event.currentTarget.value)
    },
    [store],
  )

  const handleSettingsButton = useCallback(() => {
    store.setShowingSettings(!store.showingSettings)
  }, [store])

  return (
    <Flex alignSelf="flex-start" gap="0.5rem">
      <CloseButton onClick={onCancel} />

      <Flex flexDirection="column" gap="0.5rem">
        <CardInput
          dataTestId="create-project-name-input"
          autoFocus
          height="40px"
          placeholder="project name"
          value={store.projectName}
          onChange={handleChangeName}
          onEnter={handleAdd}
        />

        {store.projectName && store.showingSettings && (
          <>
            <CardInput
              dataTestId="create-project-branch-name-input"
              height="40px"
              placeholder="branch name"
              value={store.branchName}
              onChange={handleChangeBranchName}
              onEnter={handleAdd}
            />

            <CardInput
              dataTestId="create-project-from-revision-id-input"
              height="40px"
              placeholder="from revisionId"
              value={store.fromRevisionId}
              onChange={handleChangeFromRevisionId}
              onEnter={handleAdd}
            />
          </>
        )}
      </Flex>

      {store.projectName && (
        <>
          <ApproveButton dataTestId="create-project-approve-button" loading={isLoading} onClick={handleAdd} />
          <SettingsButton
            dataTestId="create-project-settings-button"
            color={store.showingSettings ? 'gray.400' : 'gray.200'}
            onClick={handleSettingsButton}
          />
        </>
      )}
    </Flex>
  )
})
