import { Flex, Icon, IconButton, Text } from '@chakra-ui/react'
import { Popover } from '@chakra-ui/react/popover'
import { observer } from 'mobx-react-lite'
import { FC, useEffect } from 'react'
import { PiPlugsConnectedThin, PiPlugsThin } from 'react-icons/pi'
import { SiApollographql, SiSwagger } from 'react-icons/si'
import { EndpointType } from 'src/__generated__/graphql-request.ts'
import { Tooltip } from 'src/shared/ui'
import { getLabelByEndpointType } from '../../config/consts.ts'
import { RevisionEndpointPopoverModel } from 'src/features/RevisionEndpointPopover'
import { RevisionEndpointItem } from '../RevisionEndpointItem/RevisionEndpointItem.tsx'

interface RevisionEndpointPopoverProps {
  model: RevisionEndpointPopoverModel
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}

export const RevisionEndpointPopover: FC<RevisionEndpointPopoverProps> = observer(({ isOpen, setIsOpen, model }) => {
  useEffect(() => {
    model.init()
    return () => {
      model.dispose()
    }
  }, [model])

  if (!model.revision || !model.graphqlItem || !model.restApiItem) {
    return null
  }

  return (
    <Popover.Root
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
      positioning={{
        strategy: 'fixed',
      }}
    >
      <Popover.Trigger asChild>
        <IconButton
          aria-label="Endpoint settings"
          opacity={0.5}
          _hover={{ opacity: 1 }}
          variant="plain"
          size="xs"
          padding={0}
          minWidth="auto"
          height="auto"
        >
          <Tooltip content="Manage endpoints" disabled={isOpen}>
            <Icon size="sm">{model.hasEndpoints ? <PiPlugsConnectedThin /> : <PiPlugsThin />}</Icon>
          </Tooltip>
        </IconButton>
      </Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content maxWidth="240px">
          <Popover.Arrow />
          <Popover.Body>
            <Flex flexDirection="column" gap="1rem">
              <RevisionEndpointItem
                model={model.graphqlItem}
                label={getLabelByEndpointType(EndpointType.Graphql)}
                icon={<SiApollographql size={20} />}
              />
              <RevisionEndpointItem
                model={model.restApiItem}
                label={getLabelByEndpointType(EndpointType.RestApi)}
                icon={<SiSwagger size={20} />}
              />
            </Flex>
          </Popover.Body>
          <Popover.Footer justifyContent="center">
            <Text color="gray.400" opacity="0.7" fontSize="xs" as="samp">
              {model.revisionTitle}
            </Text>
          </Popover.Footer>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  )
})
