import { Box, Flex, IconButton, Menu, Portal, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { PiDotsThreeVerticalBold, PiEyeSlash, PiListBullets } from 'react-icons/pi'
import { ColumnType } from 'src/widgets/RowList/model/types'

interface ColumnHeaderProps {
  column: ColumnType
  canRemove: boolean
  canHideAll: boolean
  onRemove: () => void
  onHideAll: () => void
}

export const ColumnHeader: FC<ColumnHeaderProps> = observer(
  ({ column, canRemove, canHideAll, onRemove, onHideAll }) => {
    return (
      <Box
        as="th"
        textAlign="start"
        width={`${column.width}px`}
        maxWidth={`${column.width}px`}
        minWidth={`${column.width}px`}
        backgroundColor="white"
      >
        <Flex
          alignItems="center"
          height="30px"
          borderBottomWidth="1px"
          borderColor="gray.100"
          pl="16px"
          pr="4px"
          gap="4px"
          _hover={{ '& .column-menu': { opacity: 1 } }}
        >
          <Text flex={1} whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" color="gray.400" fontSize="sm">
            {column.title}
          </Text>
          <Menu.Root positioning={{ placement: 'bottom-end' }}>
            <Menu.Trigger asChild>
              <IconButton
                className="column-menu"
                aria-label="Column menu"
                size="xs"
                variant="ghost"
                opacity={0}
                transition="opacity 0.2s"
                color="gray.400"
                _hover={{ bg: 'gray.100', color: 'gray.600' }}
              >
                <PiDotsThreeVerticalBold />
              </IconButton>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content minW="150px">
                  <Menu.Item value="hide" disabled={!canRemove} onClick={onRemove}>
                    <PiEyeSlash />
                    <Text>Hide column</Text>
                  </Menu.Item>
                  <Menu.Item value="hide-all" disabled={!canHideAll} onClick={onHideAll}>
                    <PiListBullets />
                    <Text>Hide all columns</Text>
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Flex>
      </Box>
    )
  },
)
