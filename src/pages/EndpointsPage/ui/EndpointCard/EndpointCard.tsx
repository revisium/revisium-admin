import { Badge, Box, Button, Flex, HStack, Popover, Portal, Switch, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useState } from 'react'
import { EndpointCardViewModel } from 'src/pages/EndpointsPage/model/EndpointCardViewModel.ts'
import { Tooltip } from 'src/shared/ui'
import { EndpointActions } from '../EndpointActions/EndpointActions.tsx'

interface EndpointCardProps {
  model: EndpointCardViewModel
}

const DRAFT_TOOLTIP = 'Draft is a mutable working revision. Endpoint for reading and modifying data.'
const HEAD_TOOLTIP =
  'Head is an immutable revision pointing to the last commit. Changes made in draft become visible in head after commit.'

export const EndpointCard: FC<EndpointCardProps> = observer(({ model }) => {
  const [isDisablePopoverOpen, setIsDisablePopoverOpen] = useState(false)

  const handleToggle = useCallback(() => {
    if (model.isEnabled) {
      setIsDisablePopoverOpen(true)
    } else {
      model.enable()
    }
  }, [model])

  const handleDisableConfirm = useCallback(() => {
    setIsDisablePopoverOpen(false)
    model.disable()
  }, [model])

  const handleDisableCancel = useCallback(() => {
    setIsDisablePopoverOpen(false)
  }, [])

  const tooltipContent = model.revisionType === 'draft' ? DRAFT_TOOLTIP : HEAD_TOOLTIP

  return (
    <Box
      className="group"
      p={3}
      borderWidth="1px"
      borderColor={model.isEnabled ? 'newGray.200' : 'newGray.100'}
      borderRadius="8px"
      backgroundColor={model.isEnabled ? 'white' : 'newGray.50'}
      _hover={{ borderColor: 'newGray.300' }}
      width="100%"
      height="48px"
      transition="all 0.15s"
      opacity={model.isLoading ? 0.6 : 1}
    >
      <Flex justify="space-between" align="center" gap={3} height="100%">
        <Flex align="center" gap={2} flex={1} minWidth={0}>
          <Tooltip content={tooltipContent}>
            <Text
              fontSize="14px"
              fontWeight="500"
              color={model.isEnabled ? 'newGray.600' : 'newGray.400'}
              cursor="help"
              borderBottom="1px dashed"
              borderColor="newGray.300"
            >
              {model.revisionLabel}
            </Text>
          </Tooltip>

          {model.revisionType === 'head' && model.isEnabled && (
            <Badge size="sm" colorPalette="gray" variant="subtle">
              readonly
            </Badge>
          )}
        </Flex>

        <HStack gap={2}>
          <HStack
            opacity={0}
            _groupHover={{ opacity: model.isEnabled ? 1 : 0 }}
            transition="opacity 0.15s"
            visibility={model.isEnabled ? 'visible' : 'hidden'}
          >
            <EndpointActions
              copyTooltip={model.copyTooltip}
              sandboxUrl={model.sandboxUrl}
              swaggerUrl={model.swaggerUrl}
              onCopy={model.copyUrl}
            />
          </HStack>

          {(model.canCreate || model.canDelete) && (
            <Popover.Root
              open={isDisablePopoverOpen}
              onOpenChange={(e) => setIsDisablePopoverOpen(e.open)}
              positioning={{ placement: 'bottom-end' }}
            >
              <Popover.Anchor>
                <Switch.Root
                  size="sm"
                  checked={model.isEnabled}
                  disabled={
                    model.isLoading || (!model.canCreate && !model.isEnabled) || (!model.canDelete && model.isEnabled)
                  }
                  onCheckedChange={handleToggle}
                >
                  <Switch.HiddenInput />
                  <Switch.Control />
                </Switch.Root>
              </Popover.Anchor>
              <Portal>
                <Popover.Positioner>
                  <Popover.Content maxWidth="280px">
                    <Popover.Arrow>
                      <Popover.ArrowTip />
                    </Popover.Arrow>
                    <Popover.Body>
                      <Text fontSize="sm" mb={3}>
                        Are you sure? This endpoint will be disabled and API consumers will lose access.
                      </Text>
                      <HStack justify="flex-end" gap={2}>
                        <Button size="xs" variant="ghost" onClick={handleDisableCancel}>
                          Cancel
                        </Button>
                        <Button size="xs" colorPalette="red" onClick={handleDisableConfirm}>
                          Disable
                        </Button>
                      </HStack>
                    </Popover.Body>
                  </Popover.Content>
                </Popover.Positioner>
              </Portal>
            </Popover.Root>
          )}
        </HStack>
      </Flex>
    </Box>
  )
})
