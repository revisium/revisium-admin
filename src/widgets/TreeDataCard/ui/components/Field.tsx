import { Flex, Text } from '@chakra-ui/react'
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
          <Text color="newGray.400" textDecoration={store.deprecated ? 'line-through' : undefined}>
            {node.fieldName}:
          </Text>
        </Tooltip>
      ) : (
        <Text color="newGray.400" textDecoration={store.deprecated ? 'line-through' : undefined}>
          {node.fieldName}:
        </Text>
      )}
    </Flex>
  )
})
