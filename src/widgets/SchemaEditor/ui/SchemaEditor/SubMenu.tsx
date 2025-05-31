import { Portal } from '@chakra-ui/react'
import { Menu } from '@chakra-ui/react/menu'
import { PiCaretRightThin } from 'react-icons/pi'
import React from 'react'

interface SubMenuProps {
  label: string
  options: { id: string; label: string; addDividerAfter?: boolean }[]
  onSelect: (id: string) => void
  dataTestIdPrefix?: string
}

export const SubMenu: React.FC<SubMenuProps> = ({ label, options, onSelect, dataTestIdPrefix }) => {
  return (
    <Menu.Root positioning={{ placement: 'right-start', gutter: -8 }}>
      <Menu.TriggerItem justifyContent="space-between">
        {label}
        <PiCaretRightThin />
      </Menu.TriggerItem>

      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {options.map((option) => (
              <React.Fragment key={option.id}>
                <Menu.Item
                  value={option.id}
                  data-testid={`${dataTestIdPrefix}-submenu-${option.id}`}
                  onClick={() => onSelect(option.id)}
                >
                  {option.label}
                </Menu.Item>
                {option.addDividerAfter && <Menu.Separator />}
              </React.Fragment>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
