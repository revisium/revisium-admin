import { Box, Menu, Text } from '@chakra-ui/react'
import { FC } from 'react'
import { LuChevronDown } from 'react-icons/lu'

interface LogicSelectProps {
  logic: 'and' | 'or'
  onChange: (logic: 'and' | 'or') => void
}

export const LogicSelect: FC<LogicSelectProps> = ({ logic, onChange }) => (
  <Menu.Root positioning={{ placement: 'bottom-start' }}>
    <Menu.Trigger asChild>
      <Box
        as="button"
        display="inline-flex"
        alignItems="center"
        gap={1}
        px={2}
        py={0.5}
        borderRadius="md"
        bg="newGray.100"
        color="newGray.700"
        fontWeight="medium"
        fontSize="sm"
        _hover={{ bg: 'newGray.200' }}
        cursor="pointer"
      >
        {logic === 'and' ? 'All' : 'Any'}
        <LuChevronDown size={12} />
      </Box>
    </Menu.Trigger>
    <Menu.Positioner>
      <Menu.Content minW="100px">
        <Menu.Item value="and" onClick={() => onChange('and')}>
          <Text>All (AND)</Text>
        </Menu.Item>
        <Menu.Item value="or" onClick={() => onChange('or')}>
          <Text>Any (OR)</Text>
        </Menu.Item>
      </Menu.Content>
    </Menu.Positioner>
  </Menu.Root>
)
