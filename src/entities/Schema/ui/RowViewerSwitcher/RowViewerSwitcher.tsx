import { Button, Icon, Menu, Portal } from '@chakra-ui/react'
import React, { useMemo, useState } from 'react'
import { PiBracketsCurlyThin, PiCaretDownLight, PiLinkThin, PiTreeViewThin } from 'react-icons/pi'
import { Tooltip } from 'src/shared/ui'
import { ViewerSwitcherMode } from '../../config/consts.ts'

const modes: { mode: ViewerSwitcherMode; label: string; icon: React.ReactNode; dataTestId?: string }[] = [
  { mode: ViewerSwitcherMode.Tree, label: 'Tree', icon: <PiTreeViewThin />, dataTestId: 'row-editor-mode-tree' },
  { mode: ViewerSwitcherMode.Json, label: 'JSON', icon: <PiBracketsCurlyThin />, dataTestId: 'row-editor-mode-json' },
  { mode: ViewerSwitcherMode.RefBy, label: 'References', icon: <PiLinkThin />, dataTestId: 'row-editor-mode-refs' },
]

interface ViewerSwitcherProps {
  mode: ViewerSwitcherMode
  availableRefByMode?: boolean
  onChange?: (mode: ViewerSwitcherMode) => void
}

export const RowViewerSwitcher: React.FC<ViewerSwitcherProps> = ({ mode, onChange, availableRefByMode }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const currentModes = useMemo(
    () => modes.filter((item) => !(item.mode === ViewerSwitcherMode.RefBy && !availableRefByMode)),
    [availableRefByMode],
  )

  const currentMode = modes.find((m) => m.mode === mode) || modes[0]

  const handleValueChange = (details: { value: string }) => {
    const selectedMode = modes.find((m) => m.mode === details.value)
    if (selectedMode) {
      onChange?.(selectedMode.mode)
    }
  }

  return (
    <Menu.Root onOpenChange={({ open }) => setMenuOpen(open)}>
      <Menu.Trigger asChild>
        <Button
          variant="ghost"
          size="sm"
          height="2.5rem"
          color="gray.500"
          _hover={{ backgroundColor: 'gray.50', '& .caret': { opacity: 1 } }}
          _focus={{ outline: 'none', boxShadow: 'none' }}
          _focusVisible={{ outline: 'none', boxShadow: 'none' }}
          data-testid="view-mode-switcher"
          px="8px"
          gap="2px"
        >
          <Tooltip
            open={!menuOpen && tooltipOpen}
            onOpenChange={(details) => setTooltipOpen(details.open)}
            content="View mode"
            openDelay={500}
            closeDelay={0}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <Icon size="sm">{currentMode.icon}</Icon>
              <Icon size="xs" color="gray.400" className="caret" opacity={0} transition="opacity 0.15s">
                <PiCaretDownLight />
              </Icon>
            </span>
          </Tooltip>
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content minWidth="140px">
            <Menu.RadioItemGroup value={mode} onValueChange={handleValueChange}>
              {currentModes.map((item) => (
                <Menu.RadioItem key={item.mode} value={item.mode} data-testid={item.dataTestId} cursor="pointer">
                  <Menu.ItemIndicator />
                  <Icon size="sm" mr="8px">
                    {item.icon}
                  </Icon>
                  {item.label}
                </Menu.RadioItem>
              ))}
            </Menu.RadioItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
