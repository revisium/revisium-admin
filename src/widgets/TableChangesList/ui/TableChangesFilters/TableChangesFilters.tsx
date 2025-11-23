import { Box, Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { TypeFilterPopover } from 'src/entities/Changes'
import { TableChangesListModel } from '../../model/TableChangesListModel'

interface TableChangesFiltersProps {
  model: TableChangesListModel
}

export const TableChangesFilters: FC<TableChangesFiltersProps> = observer(({ model }) => {
  return (
    <Box mb="1rem">
      <Flex gap="0.5rem" flexWrap="wrap" alignItems="center" justifyContent="flex-end">
        <TypeFilterPopover model={model.typeFilterModel} />
      </Flex>
    </Box>
  )
})
