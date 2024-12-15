import { Flex } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { PiBracketsCurlyThin, PiLinkThin, PiTreeViewThin } from 'react-icons/pi'
import { SelectedIconButton } from 'src/shared/ui/SelectedIconButton/SelectedIconButton.tsx'
import { ViewerSwitcherMode } from '../../config/consts.ts'

const modes: { mode: ViewerSwitcherMode; icon: React.ReactNode; dataTestId?: string }[] = [
  { mode: ViewerSwitcherMode.Tree, icon: <PiTreeViewThin />, dataTestId: 'row-editor-mode-tree' },
  { mode: ViewerSwitcherMode.Json, icon: <PiBracketsCurlyThin />, dataTestId: 'row-editor-mode-json' },
  { mode: ViewerSwitcherMode.RefBy, icon: <PiLinkThin />, dataTestId: 'row-editor-mode-refs' },
]

interface ViewerSwitcherProps {
  mode: ViewerSwitcherMode
  availableRefByMode?: boolean
  onChange?: (mode: ViewerSwitcherMode) => void
}

export const RowViewerSwitcher: React.FC<ViewerSwitcherProps> = ({ mode, onChange, availableRefByMode }) => {
  const currentModes = useMemo(
    () =>
      modes.filter((item) => {
        if (item.mode === ViewerSwitcherMode.RefBy && !availableRefByMode) {
          return false
        }

        return true
      }),
    [availableRefByMode],
  )

  return (
    <Flex gap="4px">
      {currentModes.map((item) => (
        <SelectedIconButton
          dataTestId={item.dataTestId}
          isSelected={item.mode === mode}
          key={item.mode}
          onClick={() => {
            onChange?.(item.mode)
          }}
          icon={item.icon}
        />
      ))}
    </Flex>
  )
}
