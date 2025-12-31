import { Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { CreateProjectViewModel } from 'src/features/CreateProjectCard/model/CreateProjectViewModel.ts'
import { ProjectSettingsButton } from 'src/features/CreateProjectCard/ui/ProjectSettingsButton/ProjectSettingsButton.tsx'
import { useViewModel } from 'src/shared/lib'
import { ApproveButton, CardInput, CloseButton } from 'src/shared/ui'

interface CreateProjectCardProps {
  onComplete?: () => void
}

export const CreateProjectCard: React.FC<CreateProjectCardProps> = observer(({ onComplete }) => {
  const model = useViewModel(CreateProjectViewModel)

  const handleCreate = useCallback(async () => {
    const success = await model.create()
    if (success) {
      onComplete?.()
    }
  }, [model, onComplete])

  const handleChangeName: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      model.setProjectName(event.currentTarget.value)
    },
    [model],
  )

  const handleChangeBranchName: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      model.setBranchName(event.currentTarget.value)
    },
    [model],
  )

  const handleChangeFromRevisionId: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      model.setFromRevisionId(event.currentTarget.value)
    },
    [model],
  )

  return (
    <Flex alignSelf="flex-start" gap="0.5rem">
      <CloseButton onClick={onComplete} />

      <Flex flexDirection="column" gap="0.5rem">
        <CardInput
          dataTestId="create-project-name-input"
          autoFocus
          height="40px"
          placeholder="project name"
          value={model.projectName}
          onChange={handleChangeName}
          onEnter={handleCreate}
        />

        {model.projectName && model.showingSettings && (
          <>
            <CardInput
              dataTestId="create-project-branch-name-input"
              height="40px"
              placeholder="branch name"
              value={model.branchName}
              onChange={handleChangeBranchName}
              onEnter={handleCreate}
            />

            <CardInput
              dataTestId="create-project-from-revision-id-input"
              height="40px"
              placeholder="from revisionId"
              value={model.fromRevisionId}
              onChange={handleChangeFromRevisionId}
              onEnter={handleCreate}
            />
          </>
        )}
      </Flex>

      {model.projectName && (
        <>
          <ApproveButton dataTestId="create-project-approve-button" loading={model.isLoading} onClick={handleCreate} />
          <ProjectSettingsButton
            dataTestId="create-project-settings-button"
            color={model.showingSettings ? 'gray.400' : 'gray.200'}
            onClick={model.toggleSettings}
          />
        </>
      )}
    </Flex>
  )
})
