import { Box, CloseButton, HStack, Input } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { LuSearch } from 'react-icons/lu'
import {
  FileSizeFilter,
  FileStatusFilter,
  FileTypeFilter,
  getFileSizeLabel,
  getFileStatusLabel,
  getFileTypeLabel,
} from 'src/pages/AssetsPage/lib/fileFilters'
import { AssetsFilterModel } from 'src/pages/AssetsPage/model/AssetsFilterModel'
import { FilterSelect } from 'src/pages/AssetsPage/ui/FilterSelect/FilterSelect'

interface AssetsFilterProps {
  model: AssetsFilterModel
}

const FILE_TYPE_OPTIONS: FileTypeFilter[] = ['all', 'images', 'documents', 'audio', 'video', 'other']
const FILE_STATUS_OPTIONS: FileStatusFilter[] = ['all', 'uploaded', 'ready']
const FILE_SIZE_OPTIONS: FileSizeFilter[] = ['all', 'small', 'medium', 'large', 'xlarge']

export const AssetsFilter: FC<AssetsFilterProps> = observer(({ model }) => {
  const hasValue = model.search.length > 0

  return (
    <HStack gap={4} flexWrap="wrap">
      <Box position="relative" display="flex" alignItems="center">
        <Box color="gray.400" pl="2px" flexShrink={0}>
          <LuSearch size={14} />
        </Box>
        <Input
          variant="flushed"
          placeholder="Search..."
          value={model.search}
          onChange={(e) => model.setSearch(e.target.value)}
          _placeholder={{ color: 'gray.400' }}
          size="sm"
          pl="8px"
          pr={hasValue ? '28px' : '8px'}
        />
        {hasValue && (
          <CloseButton position="absolute" right="0" color="gray.400" size="xs" onClick={() => model.setSearch('')} />
        )}
      </Box>

      <HStack gap={3}>
        <FilterSelect
          value={model.type}
          onChange={model.setType}
          options={FILE_TYPE_OPTIONS}
          getLabel={getFileTypeLabel}
        />

        <FilterSelect
          value={model.status}
          onChange={model.setStatus}
          options={FILE_STATUS_OPTIONS}
          getLabel={getFileStatusLabel}
        />

        <FilterSelect
          value={model.size}
          onChange={model.setSize}
          options={FILE_SIZE_OPTIONS}
          getLabel={getFileSizeLabel}
        />
      </HStack>
    </HStack>
  )
})
