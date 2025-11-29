import { Button, Flex, Menu, Portal, Text } from '@chakra-ui/react'
import { FC, useCallback, useState } from 'react'
import { PiCaretDownLight, PiCheckLight, PiXBold } from 'react-icons/pi'
import { EndpointType } from 'src/__generated__/graphql-request'

interface TypeFilterPopoverProps {
  selectedType: EndpointType | null
  selectedTypeName: string
  onSelect: (type: EndpointType | null) => void
}

export const TypeFilterPopover: FC<TypeFilterPopoverProps> = ({ selectedType, selectedTypeName, onSelect }) => {
  const [open, setOpen] = useState(false)

  const handleSelect = (type: EndpointType | null) => {
    onSelect(type)
    setOpen(false)
  }

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onSelect(null)
    },
    [onSelect],
  )

  const hasSelection = selectedType !== null

  return (
    <Menu.Root open={open} onOpenChange={({ open }) => setOpen(open)}>
      <Menu.Trigger asChild>
        <Button color="gray" variant="ghost" size="sm" focusRing="none">
          <Flex alignItems="center" gap="0.25rem">
            <Text color={hasSelection ? 'newGray.500' : 'newGray.400'}>{selectedTypeName}</Text>
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
          <Menu.Content minWidth="160px">
            <Menu.Item value="all" onClick={() => handleSelect(null)}>
              <Text flex={1}>All types</Text>
              {selectedType === null && <PiCheckLight />}
            </Menu.Item>
            <Menu.Item value={EndpointType.Graphql} onClick={() => handleSelect(EndpointType.Graphql)}>
              <Text flex={1}>GraphQL</Text>
              {selectedType === EndpointType.Graphql && <PiCheckLight />}
            </Menu.Item>
            <Menu.Item value={EndpointType.RestApi} onClick={() => handleSelect(EndpointType.RestApi)}>
              <Text flex={1}>REST API</Text>
              {selectedType === EndpointType.RestApi && <PiCheckLight />}
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
