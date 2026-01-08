import { Button, Flex, Menu, Portal, Text } from '@chakra-ui/react'
import { FC, useCallback, useState } from 'react'
import { PiCaretDownLight, PiCheckLight, PiXBold } from 'react-icons/pi'

interface BranchOption {
  name: string
}

interface BranchFilterPopoverProps {
  branches: BranchOption[]
  selectedBranchName: string | null
  selectedBranchLabel: string
  onSelect: (branchName: string | null) => void
}

export const BranchFilterPopover: FC<BranchFilterPopoverProps> = ({
  branches,
  selectedBranchName,
  selectedBranchLabel,
  onSelect,
}) => {
  const [open, setOpen] = useState(false)

  const handleSelect = (branchName: string | null) => {
    onSelect(branchName)
    setOpen(false)
  }

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onSelect(null)
    },
    [onSelect],
  )

  const hasSelection = selectedBranchName !== null

  return (
    <Menu.Root open={open} onOpenChange={({ open }) => setOpen(open)}>
      <Menu.Trigger asChild>
        <Button color="gray" variant="ghost" size="sm" focusRing="none">
          <Flex alignItems="center" gap="0.25rem">
            <Text color={hasSelection ? 'newGray.500' : 'newGray.400'}>{selectedBranchLabel}</Text>
            {hasSelection ? (
              <PiXBold size={12} color="gray" onClick={handleClear} />
            ) : (
              <PiCaretDownLight size={12} color="gray" />
            )}
          </Flex>
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content minWidth="200px">
            <Menu.Item value="all" onClick={() => handleSelect(null)}>
              <Text flex={1}>All branches</Text>
              {selectedBranchName === null && <PiCheckLight />}
            </Menu.Item>
            {branches.map((branch) => (
              <Menu.Item key={branch.name} value={branch.name} onClick={() => handleSelect(branch.name)}>
                <Text flex={1} truncate maxW="180px">
                  {branch.name}
                </Text>
                {selectedBranchName === branch.name && <PiCheckLight />}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
