import { FC, ReactNode, useState, useCallback } from 'react'
import { FocusPopover } from 'src/widgets/TreeDataCard/ui/components/FocusPopover.tsx'
import { FocusPopoverItem } from 'src/widgets/TreeDataCard/ui/components/FocusPopoverItem.tsx'

interface BooleanMenuProps {
  children: ReactNode
  onChange: (value: boolean) => void
  disabled?: boolean
}

export const BooleanMenu: FC<BooleanMenuProps> = ({ children, onChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = useCallback(
    (value: string) => {
      const boolValue = value === 'true'
      onChange(boolValue)
      setIsOpen(false)
    },
    [onChange],
  )

  return (
    <FocusPopover width="60px" isOpen={isOpen} setIsOpen={setIsOpen} trigger={children} disabled={disabled}>
      <FocusPopoverItem onClick={() => handleSelect('true')}>true</FocusPopoverItem>
      <FocusPopoverItem onClick={() => handleSelect('false')}>false</FocusPopoverItem>
    </FocusPopover>
  )
}
