import { Box, Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { CreateProjectButton } from 'src/features/CreateProjectButton'
import { CreateProjectCard } from 'src/features/CreateProjectCard'
import { MainPageViewModel } from 'src/pages/MainPage/model/MainPageViewModel.ts'
import { useViewModel } from 'src/shared/lib'
import { Page } from 'src/shared/ui'
import { AccountButton } from 'src/widgets/AccountButton'
import { MeProjectList } from 'src/widgets/MeProjectList'

export const MainPage: FC = observer(() => {
  const model = useViewModel(MainPageViewModel)

  return (
    <Page title={<Box height="40px" />} footer={<AccountButton />}>
      <Flex flex={1} flexDirection="column" gap="0.5rem" paddingBottom="1rem">
        {model.isCreatingProject ? (
          <CreateProjectCard onComplete={model.toggleCreatingProject} />
        ) : (
          <>
            <CreateProjectButton onClick={model.toggleCreatingProject} />
            <MeProjectList onCreateProject={model.toggleCreatingProject} />
          </>
        )}
      </Flex>
    </Page>
  )
})
