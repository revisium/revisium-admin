import { Button, Flex, Menu, Portal, Text } from '@chakra-ui/react'
import { FC, useCallback, useState } from 'react'
import { PiCaretDownLight, PiCheckLight, PiXBold } from 'react-icons/pi'

interface BranchOption {
  id: string
  name: string
}

interface BranchFilterPopoverProps {
  branches: BranchOption[]
  selectedBranchId: string | null
  selectedBranchName: string
  onSelect: (branchId: string | null) => void
}

export const BranchFilterPopover: FC<BranchFilterPopoverProps> = ({
  branches,
  selectedBranchId,
  selectedBranchName,
  onSelect,
}) => {
  const [open, setOpen] = useState(false)

  const handleSelect = (branchId: string | null) => {
    onSelect(branchId)
    setOpen(false)
  }

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onSelect(null)
    },
    [onSelect],
  )

  const hasSelection = selectedBranchId !== null

  return (
    <Menu.Root open={open} onOpenChange={({ open }) => setOpen(open)}>
      <Menu.Trigger asChild>
        <Button color="gray" variant="ghost" size="sm">
          <Flex alignItems="center" gap="0.25rem">
            <Text color={hasSelection ? 'newGray.500' : 'newGray.400'}>{selectedBranchName}</Text>
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
              {selectedBranchId === null && <PiCheckLight />}
            </Menu.Item>
            {branches.map((branch) => (
              <Menu.Item key={branch.id} value={branch.id} onClick={() => handleSelect(branch.id)}>
                <Text flex={1} truncate maxW="180px">
                  {branch.name}
                </Text>
                {selectedBranchId === branch.id && <PiCheckLight />}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
