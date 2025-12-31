import { Spinner, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { useViewModel } from 'src/shared/lib'
import { MeProjectListViewModel } from 'src/widgets/MeProjectList/model/MeProjectListViewModel.ts'
import { MeProjectListEmptyState } from 'src/widgets/MeProjectList/ui/MeProjectListEmptyState/MeProjectListEmptyState.tsx'
import { ProjectListItem } from 'src/widgets/MeProjectList/ui/ProjectListItem/ProjectListItem.tsx'

interface MeProjectListProps {
  onCreateProject?: () => void
}

export const MeProjectList: FC<MeProjectListProps> = observer(({ onCreateProject }) => {
  const model = useViewModel(MeProjectListViewModel)

  if (model.showLoading) {
    return (
      <VStack flex={1} justifyContent="center">
        <Spinner size="md" color="gray.400" />
      </VStack>
    )
  }

  if (model.showError) {
    return (
      <VStack flex={1} justifyContent="center" gap="8px" color="gray.400">
        <Text fontSize="md">Could not load projects</Text>
        <Text fontSize="sm">Please retry later</Text>
      </VStack>
    )
  }

  if (model.showEmpty) {
    return <MeProjectListEmptyState onCreate={onCreateProject} />
  }

  if (model.showList) {
    return (
      <Virtuoso
        useWindowScroll
        totalCount={model.totalCount}
        defaultItemHeight={40}
        endReached={model.hasNextPage ? model.tryToFetchNextPage : undefined}
        itemContent={(index) => {
          const item = model.items[index]

          if (!item) {
            return null
          }

          return <ProjectListItem key={item.id} model={item} />
        }}
      />
    )
  }

  return null
})
