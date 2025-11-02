import { Box, Button, Flex, Link, Text } from '@chakra-ui/react'
import { Switch } from '@chakra-ui/react/switch'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { PiShareFatThin } from 'react-icons/pi'
import { RevisionEndpointItemModel } from '../../model/RevisionEndpointItemModel.ts'

interface RevisionEndpointItemProps {
  model: RevisionEndpointItemModel
  label: string
  icon: React.ReactNode
}

export const RevisionEndpointItem: FC<RevisionEndpointItemProps> = observer(({ model, label, icon }) => {
  return (
    <Flex alignItems="center" gap="0.5rem" minWidth="90px" height="25px">
      <Box color={model.isEnabled ? 'gray.400' : 'gray.300'}>{icon}</Box>
      <Text width="140px" color="gray.400">
        {label}
      </Text>
      <Flex width="120px" gap="0.5rem" alignItems="center">
        <Switch.Root colorPalette="gray" checked={model.isEnabled} onCheckedChange={model.toggle}>
          <Switch.HiddenInput />
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch.Root>
        {model.isEnabled && model.href && (
          <Link href={model.href} target="_blank" rel="noopener noreferrer">
            <Button
              size="sm"
              aria-label="Open endpoint"
              color="gray.500"
              variant="ghost"
              padding={0}
              minWidth="20px"
              minHeight="20px"
              height="20px"
              paddingBottom="3px"
            >
              <PiShareFatThin size="20px" />
            </Button>
          </Link>
        )}
      </Flex>
    </Flex>
  )
})
