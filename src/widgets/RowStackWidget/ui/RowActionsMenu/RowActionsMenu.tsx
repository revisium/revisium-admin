import { IconButton, Menu, Portal } from '@chakra-ui/react'
import React from 'react'
import { LuChevronsDownUp, LuChevronsUpDown, LuCopy, LuMoreVertical } from 'react-icons/lu'

interface RowActionsMenuProps {
  onExpandAll?: () => void
  onCollapseAll?: () => void
  onCopyJson?: () => void
  showTreeActions?: boolean
}

export const RowActionsMenu: React.FC<RowActionsMenuProps> = ({
  onExpandAll,
  onCollapseAll,
  onCopyJson,
  showTreeActions,
}) => {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <IconButton
          aria-label="Row actions"
          data-testid="row-actions-menu"
          variant="ghost"
          size="sm"
          height="2.5rem"
          color="gray.400"
          _hover={{ backgroundColor: 'gray.50' }}
          _focus={{ outline: 'none', boxShadow: 'none' }}
          _focusVisible={{ outline: 'none', boxShadow: 'none' }}
        >
          <LuMoreVertical />
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content minWidth="160px">
            {showTreeActions && (
              <>
                <Menu.Item value="expand" cursor="pointer" onClick={onExpandAll}>
                  <LuChevronsUpDown style={{ marginRight: '8px' }} />
                  Expand All
                </Menu.Item>
                <Menu.Item value="collapse" cursor="pointer" onClick={onCollapseAll}>
                  <LuChevronsDownUp style={{ marginRight: '8px' }} />
                  Collapse All
                </Menu.Item>
                <Menu.Separator />
              </>
            )}
            <Menu.Item value="copy" cursor="pointer" onClick={onCopyJson}>
              <LuCopy style={{ marginRight: '8px' }} />
              Copy JSON
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
