import { Flex } from '@chakra-ui/react'
import React from 'react'
import { PiBracketsCurlyThin, PiTableThin } from 'react-icons/pi'
import { ViewMode } from 'src/pages/MigrationsPage/config/viewMode.ts'
import { SelectedIconButton } from 'src/shared/ui/SelectedIconButton/SelectedIconButton'

interface MigrationsViewSwitcherProps {
  mode: ViewMode
  onChange: (mode: ViewMode) => void
}

const modes: { mode: ViewMode; icon: React.ReactNode; dataTestId?: string }[] = [
  { mode: ViewMode.Table, icon: <PiTableThin />, dataTestId: 'migrations-mode-table' },
  { mode: ViewMode.Json, icon: <PiBracketsCurlyThin />, dataTestId: 'migrations-mode-json' },
]

export const MigrationsViewSwitcher: React.FC<MigrationsViewSwitcherProps> = ({ mode, onChange }) => {
  return (
    <Flex gap="4px">
      {modes.map((item) => (
        <SelectedIconButton
          dataTestId={item.dataTestId}
          isSelected={item.mode === mode}
          key={item.mode}
          onClick={() => onChange(item.mode)}
          icon={item.icon}
        />
      ))}
    </Flex>
  )
}
