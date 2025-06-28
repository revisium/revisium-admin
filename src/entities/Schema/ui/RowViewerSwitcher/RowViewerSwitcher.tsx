import { Flex } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { PiBracketsCurlyThin, PiLinkThin, PiOpenAiLogoThin, PiTreeViewThin } from 'react-icons/pi'
import { SelectedIconButton } from 'src/shared/ui/SelectedIconButton/SelectedIconButton.tsx'
import { ViewerSwitcherMode } from '../../config/consts.ts'

const modes: { mode: ViewerSwitcherMode; icon: React.ReactNode; dataTestId?: string }[] = [
  { mode: ViewerSwitcherMode.Tree, icon: <PiTreeViewThin />, dataTestId: 'row-editor-mode-tree' },
  { mode: ViewerSwitcherMode.Json, icon: <PiBracketsCurlyThin />, dataTestId: 'row-editor-mode-json' },
  { mode: ViewerSwitcherMode.RefBy, icon: <PiLinkThin />, dataTestId: 'row-editor-mode-refs' },
  { mode: ViewerSwitcherMode.AI, icon: <PiOpenAiLogoThin />, dataTestId: 'row-editor-mode-ai' },
]

interface ViewerSwitcherProps {
  mode: ViewerSwitcherMode
  isEdit?: boolean
  availableRefByMode?: boolean
  onChange?: (mode: ViewerSwitcherMode) => void
}

export const RowViewerSwitcher: React.FC<ViewerSwitcherProps> = ({ mode, onChange, isEdit, availableRefByMode }) => {
  const currentModes = useMemo(
    () =>
      modes.filter((item) => {
        if (item.mode === ViewerSwitcherMode.RefBy && !availableRefByMode) {
          return false
        } else if (item.mode === ViewerSwitcherMode.AI && !isEdit) {
          return false
        }

        return true
      }),
    [availableRefByMode, isEdit],
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
