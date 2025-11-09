import { Box, Flex, Popover, Portal, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { PatchItemModel } from 'src/pages/MigrationsPage/model/PatchItemModel'
import { JsonCard } from 'src/shared/ui'

interface MigrationsTableRowProps {
  model: PatchItemModel
}

export const MigrationsTableRow: FC<MigrationsTableRowProps> = observer(({ model }) => {
  return (
    <Box height="2.5rem" width="100%" data-testid={`patch-${model.id}`}>
      <Popover.Root
        lazyMount
        unmountOnExit
        positioning={{ placement: 'bottom' }}
        open={model.isPopoverOpen}
        onOpenChange={({ open }) => model.setPopoverOpen(open)}
      >
        <Popover.Trigger asChild>
          <Flex
            _hover={{ backgroundColor: 'gray.50' }}
            alignItems="center"
            gap="4px"
            paddingLeft="1rem"
            minHeight="40px"
          >
            <Box width="100px" flexShrink={0}>
              <Text textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden" title={model.tableId}>
                {model.tableId}
              </Text>
            </Box>

            <Box width="80px" flexShrink={0} marginLeft="16px">
              <Text color="newGray.400">{model.op}</Text>
            </Box>

            <Box width="80px" flexShrink={0} marginLeft="16px">
              <Text color="newGray.400">{model.typeFromSchema}</Text>
            </Box>

            <Box width="200px" marginLeft="16px">
              <Text color="newGray.400" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
                {model.displayPath}
              </Text>
            </Box>

            <Box width="200px" flexShrink={0} marginLeft="16px">
              <Text color="newGray.400" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
                {model.displayFrom}
              </Text>
            </Box>
          </Flex>
        </Popover.Trigger>

        <Portal>
          <Popover.Positioner>
            <Popover.Content width="800px" maxHeight="350px" overflow="auto">
              <Popover.CloseTrigger />
              <Popover.Body>
                <JsonCard readonly data={model.fullPatchData} />
              </Popover.Body>
            </Popover.Content>
          </Popover.Positioner>
        </Portal>
      </Popover.Root>
    </Box>
  )
})
