import { Box, Flex, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { MigrationsViewModel } from 'src/pages/MigrationsPage/model/MigrationsViewModel'
import { MigrationsTableRow } from 'src/pages/MigrationsPage/ui/MigrationsTableView/MigrationsTableRow.tsx'

interface MigrationsTableViewProps {
  model: MigrationsViewModel
}

export const MigrationsTableView: React.FC<MigrationsTableViewProps> = observer(({ model }) => {
  if (model.isEmpty) {
    return (
      <Flex justify="center" align="center" minHeight="200px">
        <Text color="gray.400">No operations found</Text>
      </Flex>
    )
  }

  return (
    <Box>
      <Flex
        alignItems="center"
        gap="4px"
        paddingLeft="1rem"
        minHeight="32px"
        borderBottom="1px solid"
        borderColor="newGray.100"
        color="newGray.400"
        mb="1rem"
      >
        <Box width="100px" flexShrink={0}>
          <Text>Table</Text>
        </Box>

        <Box width="80px" flexShrink={0} marginLeft="16px">
          <Text>Operation</Text>
        </Box>

        <Box width="80px" flexShrink={0} marginLeft="16px">
          <Text>Type</Text>
        </Box>

        <Box width="200px" marginLeft="16px">
          <Text>Path</Text>
        </Box>

        <Box width="200px" flexShrink={0} marginLeft="16px">
          <Text>From</Text>
        </Box>

        <Box width="140px" flexShrink={0} marginLeft="16px">
          <Text>Date</Text>
        </Box>
      </Flex>

      {model.items.map((item) => (
        <MigrationsTableRow key={item.id} model={item} />
      ))}
    </Box>
  )
})
