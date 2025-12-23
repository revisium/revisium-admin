import { Box, Menu, Text } from '@chakra-ui/react'
import { FC } from 'react'
import { LuChevronDown } from 'react-icons/lu'
import { SearchLanguage, SearchType, SEARCH_LANGUAGES } from 'src/widgets/RowList/model/filterTypes'

const SEARCH_TYPES = [
  { value: SearchType.Plain, label: 'plain — Words (any order)' },
  { value: SearchType.Phrase, label: 'phrase — Exact phrase' },
  { value: SearchType.Prefix, label: 'prefix — Partial words' },
  { value: SearchType.Tsquery, label: 'tsquery — Raw (word:* & other | !not)' },
] as const

interface SelectOption<T extends string> {
  value: T
  label: string
}

interface GenericSelectProps<T extends string> {
  value: T
  options: readonly SelectOption<T>[]
  onChange: (value: T) => void
  minWidth?: string
  maxHeight?: string
}

const GenericSelect = <T extends string>({
  value,
  options,
  onChange,
  minWidth = '100px',
  maxHeight,
}: GenericSelectProps<T>) => {
  const selectedLabel = options.find((opt) => opt.value === value)?.label || value

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
          minWidth={minWidth}
        >
          <Text fontSize="sm" color="newGray.700" truncate>
            {selectedLabel}
          </Text>
          <Box color="newGray.400">
            <LuChevronDown size={14} />
          </Box>
        </Box>
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content minW={minWidth} maxH={maxHeight} overflowY={maxHeight ? 'auto' : undefined}>
          {options.map((opt) => (
            <Menu.Item
              key={opt.value}
              value={opt.value}
              onClick={() => onChange(opt.value)}
              bg={value === opt.value ? 'newGray.100' : undefined}
            >
              <Text>{opt.label}</Text>
            </Menu.Item>
          ))}
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  )
}

interface SearchLanguageSelectProps {
  value: SearchLanguage
  onChange: (value: SearchLanguage) => void
}

export const SearchLanguageSelect: FC<SearchLanguageSelectProps> = ({ value, onChange }) => (
  <GenericSelect value={value} options={SEARCH_LANGUAGES} onChange={onChange} minWidth="180px" maxHeight="300px" />
)

interface SearchTypeSelectProps {
  value: SearchType
  onChange: (value: SearchType) => void
}

export const SearchTypeSelect: FC<SearchTypeSelectProps> = ({ value, onChange }) => (
  <GenericSelect value={value} options={SEARCH_TYPES} onChange={onChange} minWidth="150px" />
)
