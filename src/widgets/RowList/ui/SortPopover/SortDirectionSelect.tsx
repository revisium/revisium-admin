import { Box, Menu, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { LuArrowDown, LuArrowUp, LuChevronDown } from 'react-icons/lu'
import { SortDirection } from 'src/widgets/RowList/config/sortTypes'

interface SortDirectionSelectProps {
  selectedDirection: SortDirection
  onSelect: (direction: SortDirection) => void
}

const directions: { value: SortDirection; label: string; icon: typeof LuArrowUp }[] = [
  { value: 'asc', label: 'A → Z', icon: LuArrowUp },
  { value: 'desc', label: 'Z → A', icon: LuArrowDown },
]

export const SortDirectionSelect: FC<SortDirectionSelectProps> = observer(({ selectedDirection, onSelect }) => {
  const selected = directions.find((d) => d.value === selectedDirection) || directions[0]
  const Icon = selected.icon

  return (
    <Menu.Root positioning={{ placement: 'bottom-start' }}>
      <Menu.Trigger asChild>
        <Box
          as="button"
          display="flex"
          alignItems="center"
          gap={1}
          px={2}
          py={1}
          borderRadius="md"
          bg="newGray.100"
          _hover={{ bg: 'newGray.200' }}
          cursor="pointer"
          minWidth="80px"
        >
          <Box color="blue.500">
            <Icon size={14} />
          </Box>
          <Text fontSize="sm" fontWeight="medium" color="newGray.700">
            {selected.label}
          </Text>
          <Box color="newGray.400">
            <LuChevronDown size={14} />
          </Box>
        </Box>
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content minW="120px">
          {directions.map((dir) => {
            const DirIcon = dir.icon
            return (
              <Menu.Item
                key={dir.value}
                value={dir.value}
                onClick={() => onSelect(dir.value)}
                bg={selectedDirection === dir.value ? 'newGray.100' : undefined}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Box color="blue.500">
                    <DirIcon size={14} />
                  </Box>
                  <Text>{dir.label}</Text>
                </Box>
              </Menu.Item>
            )
          })}
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  )
})
