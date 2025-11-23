import { Box, Flex, Input } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { PiXBold } from 'react-icons/pi'
import { TypeFilterPopover } from 'src/entities/Changes'
import { RowChangesListModel } from '../../model/RowChangesListModel'
import { TableFilterPopover } from '../TableFilterPopover/TableFilterPopover'

interface RowChangesFiltersProps {
  model: RowChangesListModel
}

export const RowChangesFilters: FC<RowChangesFiltersProps> = observer(({ model }) => {
  return (
    <Box mb="1rem">
      <Flex gap="0.5rem" flexWrap="wrap" alignItems="center" justifyContent="flex-end">
        {model.showSearch && (
          <Box position="relative">
            <Input
              size="sm"
              variant="flushed"
              placeholder="Search rows..."
              value={model.search}
              onChange={(e) => model.setSearch(e.target.value)}
              width="180px"
              paddingRight={model.search ? '2rem' : undefined}
            />
            {model.search && (
              <Box
                as="button"
                position="absolute"
                right="0.5rem"
                top="50%"
                transform="translateY(-50%)"
                color="newGray.400"
                _hover={{ color: 'newGray.500' }}
                onClick={() => model.setSearch('')}
              >
                <PiXBold size={12} />
              </Box>
            )}
          </Box>
        )}

        {model.showTableFilter && <TableFilterPopover model={model.tableFilterModel} />}

        <TypeFilterPopover model={model.typeFilterModel} />
      </Flex>
    </Box>
  )
})
