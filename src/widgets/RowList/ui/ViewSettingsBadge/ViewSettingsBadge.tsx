import { Badge, Box, Button, Popover, Portal, Spinner, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { LuInfo, LuRotateCcw, LuSave } from 'react-icons/lu'
import { Tooltip } from 'src/shared/ui'
import { ViewSettingsBadgeModel } from './ViewSettingsBadgeModel'

interface ViewSettingsBadgeProps {
  model: ViewSettingsBadgeModel
}

export const ViewSettingsBadge: FC<ViewSettingsBadgeProps> = observer(({ model }) => {
  if (!model.isVisible) {
    return null
  }

  const badgeProps = {
    variant: 'subtle' as const,
    size: 'sm' as const,
    cursor: 'pointer' as const,
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: 1,
    _hover: { opacity: 0.8 },
  }

  const popoverContentProps = {
    p: 0,
    borderRadius: 'md',
    boxShadow: 'lg',
    maxWidth: '280px',
  }

  return (
    <Popover.Root open={model.isOpen} onOpenChange={(e) => model.setOpen(e.open)} lazyMount unmountOnExit>
      <Tooltip content={model.tooltipText} positioning={{ placement: 'top' }} disabled={model.isOpen}>
        <Popover.Trigger asChild>
          <Badge
            colorPalette={model.badgeColor}
            {...badgeProps}
            data-testid="view-settings-badge"
            data-badge-color={model.badgeColor}
          >
            <Box as="span" width="6px" height="6px" borderRadius="full" bg={model.dotColor} />
            {model.badgeText}
          </Badge>
        </Popover.Trigger>
      </Tooltip>
      <Portal>
        <Popover.Positioner>
          <Popover.Content {...popoverContentProps}>
            <Box borderWidth={1} borderColor="newGray.100" borderRadius="md" p={3} bg="white">
              <Box display="flex" alignItems="flex-start" gap={2} mb={3}>
                <Box color="newGray.400" mt="2px">
                  <LuInfo size={16} />
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color="newGray.600">
                    {model.title}
                  </Text>
                  <Text fontSize="xs" color="newGray.500" mt={1}>
                    {model.description}
                  </Text>
                </Box>
              </Box>
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button
                  size="xs"
                  variant="ghost"
                  colorPalette="gray"
                  focusRing="none"
                  onClick={model.revert}
                  disabled={model.isRevertDisabled}
                  data-testid="view-settings-revert"
                >
                  <LuRotateCcw size={14} />
                  {model.revertButtonText}
                </Button>
                {model.showSaveButton && (
                  <Button
                    size="xs"
                    variant="subtle"
                    colorPalette="gray"
                    focusRing="none"
                    onClick={model.save}
                    disabled={model.isSaveDisabled}
                    data-testid="view-settings-save"
                  >
                    {model.isSaving ? (
                      <Spinner size="xs" />
                    ) : (
                      <>
                        <LuSave size={14} />
                        Save
                      </>
                    )}
                  </Button>
                )}
              </Box>
            </Box>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
})
