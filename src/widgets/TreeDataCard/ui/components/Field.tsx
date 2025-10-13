import { Flex, Portal, Text, Menu } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { Tooltip } from 'src/shared/ui'
import { BaseValueNode } from 'src/widgets/TreeDataCard/model/BaseValueNode.ts'

interface RowFieldProps {
  node: BaseValueNode
}

export const Field: FC<RowFieldProps> = observer(({ node }) => {
  const store = node.getStore()

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        {
          <Flex height="28px" alignItems="center">
            {store.description ? (
              <Tooltip
                openDelay={350}
                closeDelay={50}
                showArrow
                content={store.description}
                positioning={{
                  placement: 'right-end',
                }}
              >
                <Text
                  color="gray.400"
                  _hover={{ color: 'gray' }}
                  textDecoration={store.deprecated ? 'line-through' : undefined}
                >
                  {node.fieldName}:
                </Text>
              </Tooltip>
            ) : (
              <Text
                cursor="pointer"
                color="gray.400"
                _hover={{ color: 'gray' }}
                textDecoration={store.deprecated ? 'line-through' : undefined}
              >
                {node.fieldName}:
              </Text>
            )}
          </Flex>
        }
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="1">Menu</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
})
