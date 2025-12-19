import { Box, Menu, Text } from '@chakra-ui/react'
import { FC } from 'react'
import { LuChevronDown } from 'react-icons/lu'
import { SearchLanguage, SearchType, SEARCH_LANGUAGES } from 'src/widgets/RowList/model/filterTypes'

const SEARCH_TYPES = [
  { value: SearchType.Plain, label: 'Words (any order)' },
  { value: SearchType.Phrase, label: 'Exact phrase' },
] as const

interface SearchLanguageSelectProps {
  value: SearchLanguage
  onChange: (value: SearchLanguage) => void
}

export const SearchLanguageSelect: FC<SearchLanguageSelectProps> = ({ value, onChange }) => {
  const selectedLabel = SEARCH_LANGUAGES.find((lang) => lang.value === value)?.label || value

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
          minWidth="100px"
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
        <Menu.Content minW="180px" maxH="300px" overflowY="auto">
          {SEARCH_LANGUAGES.map((lang) => (
            <Menu.Item
              key={lang.value}
              value={lang.value}
              onClick={() => onChange(lang.value)}
              bg={value === lang.value ? 'newGray.100' : undefined}
            >
              <Text>{lang.label}</Text>
            </Menu.Item>
          ))}
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  )
}

interface SearchTypeSelectProps {
  value: SearchType
  onChange: (value: SearchType) => void
}

export const SearchTypeSelect: FC<SearchTypeSelectProps> = ({ value, onChange }) => {
  const selectedLabel = SEARCH_TYPES.find((type) => type.value === value)?.label || value

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
          minWidth="120px"
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
        <Menu.Content minW="150px">
          {SEARCH_TYPES.map((type) => (
            <Menu.Item
              key={type.value}
              value={type.value}
              onClick={() => onChange(type.value)}
              bg={value === type.value ? 'newGray.100' : undefined}
            >
              <Text>{type.label}</Text>
            </Menu.Item>
          ))}
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  )
}
