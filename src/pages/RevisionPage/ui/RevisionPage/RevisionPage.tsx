import { Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'

import { useRevisionPageModel } from 'src/pages/RevisionPage/hooks/useRevisionPageModel.ts'
import { TableStackModelContext } from 'src/pages/RevisionPage/model/TableStackModelContext.ts'
import { TableStack } from 'src/pages/RevisionPage/ui/TableStack/TableStack.tsx'
import { BranchPageTitleWidget } from 'src/widgets/BranchPageTitleWidget'

export const RevisionPage: React.FC = observer(() => {
  const store = useRevisionPageModel()

  return (
    <Flex flexDirection="column" gap="0.5rem" flex={1}>
      <Flex
        alignItems="center"
        backgroundColor="white"
        borderBottom="1px solid"
        borderBottomColor="gray.50"
        justifyContent="space-between"
        width="100%"
        position="sticky"
        zIndex={1}
        top={0}
      >
        <BranchPageTitleWidget />
      </Flex>

      {store.stack.map((item) => (
        <TableStackModelContext.Provider
          key={item.id}
          value={{
            root: store,
            item,
          }}
        >
          <TableStack />
        </TableStackModelContext.Provider>
      ))}
    </Flex>
  )
})
