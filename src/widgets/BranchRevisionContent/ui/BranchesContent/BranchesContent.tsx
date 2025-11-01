import { Flex, Text, Spinner } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { BranchesViewModel } from 'src/widgets/BranchRevisionContent/model/BranchesViewModel.ts'
import { Empty } from 'src/widgets/BranchRevisionContent/ui/BranchesContent/Empty.tsx'
import { BranchesList } from 'src/widgets/BranchRevisionContent/ui/BranchesContent/BranchesList.tsx'
import { useViewModel } from 'src/shared/lib'
import { useProjectPageModel } from 'src/shared/model/ProjectPageModel/hooks/useProjectPageModel.ts'

interface BranchesContentProps {
  onSelect: (branchId: string) => void
}

export const BranchesContent: FC<BranchesContentProps> = observer(({ onSelect }) => {
  const projectPageModel = useProjectPageModel()
  const model = useViewModel(BranchesViewModel, projectPageModel)

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
            Could not load branches. Please retry later.
          </Text>
        </Flex>
      )}

      {model.showEmpty && <Empty />}

      {model.showList && <BranchesList branches={model.branches} onSelect={onSelect} />}
    </Flex>
  )
})
