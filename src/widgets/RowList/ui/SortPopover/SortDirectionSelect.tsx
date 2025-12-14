import { Box, Menu, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { LuArrowDown, LuArrowUp } from 'react-icons/lu'
import { SortDirection } from 'src/widgets/RowList/config/sortTypes'
import { SelectTrigger } from 'src/widgets/RowList/ui/shared'

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
        <SelectTrigger
          icon={
            <Box color="blue.500">
              <Icon size={14} />
            </Box>
          }
          minWidth="80px"
        >
          {selected.label}
        </SelectTrigger>
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
