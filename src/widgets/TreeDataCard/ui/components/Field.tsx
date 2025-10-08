import { Flex, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, PropsWithChildren } from 'react'
import { Tooltip } from 'src/shared/ui'
import { BaseValueNode } from 'src/widgets/TreeDataCard/model/BaseValueNode.ts'

interface RowFieldEditor2Props {
  node: BaseValueNode
}

export const Field: FC<RowFieldEditor2Props & PropsWithChildren> = observer(({ node }) => {
  const store = node.getStore()

  return (
    <Flex>
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
          <Text color="gray.400" textDecoration={store.deprecated ? 'line-through' : undefined}>
            {node.fieldName}:
          </Text>
        </Tooltip>
      ) : (
        <Text color="gray.400" textDecoration={store.deprecated ? 'line-through' : undefined}>
          {node.fieldName}:
        </Text>
      )}
    </Flex>
  )
})
