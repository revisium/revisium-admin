import { Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useViewModel } from 'src/shared/lib/hooks/useViewModel.ts'
import { TableStackManager } from 'src/pages/RevisionPage/model/TableStackManager.ts'
import { TableStack } from 'src/pages/RevisionPage/ui/TableStack/TableStack.tsx'
import { BranchPageTitleWidget } from 'src/widgets/BranchPageTitleWidget'

export const RevisionPage: React.FC = observer(() => {
  const manager = useViewModel(TableStackManager)

  return (
    <Flex flexDirection="column" gap="0.5rem" flex={1}>
      <Flex
        alignItems="flex-start"
        backgroundColor="white"
        justifyContent="space-between"
        width="100%"
        position="sticky"
        zIndex={3}
        top={0}
        px={3}
        pt="32px"
        pb="48px"
      >
        <BranchPageTitleWidget />
      </Flex>

      {manager.stack.map((item) => (
        <TableStack key={item.id} item={item} />
      ))}
    </Flex>
  )
})
