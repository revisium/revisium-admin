import { Box, Flex } from '@chakra-ui/react'
import { FC, useCallback } from 'react'
import { useToggle } from 'react-use'
import { CreateProjectButton } from 'src/features/CreateProjectButton'
import { CreateProjectCard } from 'src/features/CreateProjectCard'
import { Page } from 'src/shared/ui'
import { MeProjectList } from 'src/widgets/MeProjectList'

export const MainPage: FC = () => {
  const [isCreatingProject, toggleTable] = useToggle(false)

  const handleAdd = useCallback(() => {
    toggleTable()
  }, [toggleTable])

  return (
    <Page title={<Box height="40px" />}>
      <Flex flex={1} flexDirection="column" gap="0.5rem" paddingBottom="1rem">
        {isCreatingProject ? (
          <CreateProjectCard onAdd={handleAdd} onCancel={toggleTable} />
        ) : (
          <>
            <CreateProjectButton onClick={toggleTable} />
            <MeProjectList onCreateProject={toggleTable} />
          </>
        )}
      </Flex>
    </Page>
  )
}
