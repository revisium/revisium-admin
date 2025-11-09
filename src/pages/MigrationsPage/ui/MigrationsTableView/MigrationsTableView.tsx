import { Box, Flex, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { MigrationsViewModel } from 'src/pages/MigrationsPage/model/MigrationsViewModel'
import { MigrationsTableRow } from './MigrationsTableRow'

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
      {model.items.map((item) => (
        <MigrationsTableRow key={item.id} model={item} />
      ))}
    </Box>
  )
})
