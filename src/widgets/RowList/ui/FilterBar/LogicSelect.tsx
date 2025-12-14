import { Menu, Text } from '@chakra-ui/react'
import { FC } from 'react'
import { SelectTrigger } from 'src/widgets/RowList/ui/shared'

interface LogicSelectProps {
  logic: 'and' | 'or'
  onChange: (logic: 'and' | 'or') => void
}

export const LogicSelect: FC<LogicSelectProps> = ({ logic, onChange }) => (
  <Menu.Root positioning={{ placement: 'bottom-start' }}>
    <Menu.Trigger asChild>
      <SelectTrigger minWidth="60px" compact>
        {logic === 'and' ? 'All' : 'Any'}
      </SelectTrigger>
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
