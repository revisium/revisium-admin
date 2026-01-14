import { Box, HStack, IconButton, Input, NativeSelect } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { PiMagnifyingGlassLight, PiXLight } from 'react-icons/pi'
import {
  FileSizeFilter,
  FileStatusFilter,
  FileTypeFilter,
  getFileSizeLabel,
  getFileStatusLabel,
  getFileTypeLabel,
} from 'src/pages/AssetsPage/lib/fileFilters'
import { AssetsFilterModel } from 'src/pages/AssetsPage/model/AssetsFilterModel'

interface AssetsFilterProps {
  model: AssetsFilterModel
}

const FILE_TYPE_OPTIONS: FileTypeFilter[] = ['all', 'images', 'documents', 'audio', 'video', 'other']
const FILE_STATUS_OPTIONS: FileStatusFilter[] = ['all', 'uploaded', 'ready']
const FILE_SIZE_OPTIONS: FileSizeFilter[] = ['all', 'small', 'medium', 'large', 'xlarge']

export const AssetsFilter: FC<AssetsFilterProps> = observer(({ model }) => {
  return (
    <HStack gap={3} width="100%" flexWrap="wrap">
      <Box position="relative" flex="1" minWidth="200px" maxWidth="400px">
        <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="fg.muted" zIndex={1}>
          <PiMagnifyingGlassLight size={18} />
        </Box>
        <Input
          placeholder="Search by filename..."
          value={model.search}
          onChange={(e) => model.setSearch(e.target.value)}
          pl={10}
          pr={model.search ? 9 : 3}
          size="sm"
        />
        {model.search && (
          <IconButton
            position="absolute"
            right={1}
            top="50%"
            transform="translateY(-50%)"
            size="xs"
            variant="ghost"
            color="fg.muted"
            aria-label="Clear search"
            onClick={() => model.setSearch('')}
            zIndex={1}
          >
            <PiXLight />
          </IconButton>
        )}
      </Box>

      <NativeSelect.Root size="sm" width="130px">
        <NativeSelect.Field value={model.type} onChange={(e) => model.setType(e.target.value as FileTypeFilter)}>
          {FILE_TYPE_OPTIONS.map((type) => (
            <option key={type} value={type}>
              {getFileTypeLabel(type)}
            </option>
          ))}
        </NativeSelect.Field>
      </NativeSelect.Root>

      <NativeSelect.Root size="sm" width="150px">
        <NativeSelect.Field value={model.status} onChange={(e) => model.setStatus(e.target.value as FileStatusFilter)}>
          {FILE_STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {getFileStatusLabel(status)}
            </option>
          ))}
        </NativeSelect.Field>
      </NativeSelect.Root>

      <NativeSelect.Root size="sm" width="140px">
        <NativeSelect.Field value={model.size} onChange={(e) => model.setSize(e.target.value as FileSizeFilter)}>
          {FILE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {getFileSizeLabel(size)}
            </option>
          ))}
        </NativeSelect.Field>
      </NativeSelect.Root>
    </HStack>
  )
})
