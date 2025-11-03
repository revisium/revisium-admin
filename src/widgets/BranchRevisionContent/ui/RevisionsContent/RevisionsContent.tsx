import { Flex, Text, Spinner } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { useViewModel } from 'src/shared/lib'
import { ProjectPageModel } from 'src/shared/model/ProjectPageModel/ProjectPageModel.ts'
import { RevisionsViewModel } from 'src/widgets/BranchRevisionContent/model/RevisionsViewModel.ts'
import { Empty } from 'src/widgets/BranchRevisionContent/ui/RevisionsContent/Empty.tsx'
import { RevisionsList } from 'src/widgets/BranchRevisionContent/ui/RevisionsContent/RevisionsList.tsx'

interface RevisionsContentProps {
  project: ProjectPageModel
}

export const RevisionsContent: FC<RevisionsContentProps> = observer(({ project }) => {
  const model = useViewModel(RevisionsViewModel, project)

  return (
    <Flex flexDirection="column" height="250px" width="100%" overflow="hidden">
      {model.showLoading && (
        <Flex justify="center" align="center" height="100%" width="100%">
          <Spinner size="md" color="gray.400" />
        </Flex>
      )}

      {model.showError && (
        <Flex justify="center" align="center" height="100%" width="100%">
          <Text fontSize="sm" color="gray.500">
            Could not load revisions. Please retry later.
          </Text>
        </Flex>
      )}

      {model.showEmpty && <Empty />}

      {model.showList && (
        <RevisionsList
          revisions={model.revisions}
          onEndReached={model.canLoadMore ? model.tryToFetchNextPage : undefined}
        />
      )}
    </Flex>
  )
})
