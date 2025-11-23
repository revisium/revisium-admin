import { Button, Flex, Menu, Portal, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import { PiCaretDownBold, PiXBold } from 'react-icons/pi'
import { TypeFilterModel } from '../../model/TypeFilterModel'

interface TypeFilterPopoverProps {
  model: TypeFilterModel
}

export const TypeFilterPopover: FC<TypeFilterPopoverProps> = observer(({ model }) => {
  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      model.clear()
    },
    [model],
  )

  return (
    <Menu.Root open={model.isOpen} onOpenChange={({ open }) => model.setIsOpen(open)}>
      <Menu.Trigger asChild>
        <Button variant="ghost" size="sm" fontWeight="normal" focusRing="none">
          <Flex alignItems="center" gap="0.25rem">
            <Text fontSize="14px" color={model.hasSelection ? 'newGray.500' : 'newGray.400'}>
              {model.displayText}
            </Text>
            {model.hasSelection ? (
              <PiXBold size={12} color="gray" onClick={handleClear} />
            ) : (
              <PiCaretDownBold size={12} color="gray" />
            )}
          </Flex>
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content minWidth="150px">
            <Menu.ItemGroup>
              {model.filterableTypes.map((type) => (
                <Menu.CheckboxItem
                  key={type}
                  value={type}
                  checked={model.isChecked(type)}
                  onCheckedChange={() => model.toggleType(type)}
                >
                  {model.getLabel(type)}
                  <Menu.ItemIndicator />
                </Menu.CheckboxItem>
              ))}
            </Menu.ItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
})
