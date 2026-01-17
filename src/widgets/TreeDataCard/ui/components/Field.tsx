import { Box, Flex, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { PiFunctionLight } from 'react-icons/pi'
import { JsonSchemaTypeName } from 'src/entities/Schema'
import { Tooltip } from 'src/shared/ui'
import { BaseValueNode } from 'src/widgets/TreeDataCard/model/BaseValueNode.ts'

interface RowFieldProps {
  node: BaseValueNode
}

export const Field: FC<RowFieldProps> = observer(({ node }) => {
  const store = node.getStore()
  const isPrimitive =
    store.type === JsonSchemaTypeName.String ||
    store.type === JsonSchemaTypeName.Number ||
    store.type === JsonSchemaTypeName.Boolean
  const formula = isPrimitive && 'formula' in store ? store.formula : undefined

  const getTooltipContent = () => {
    if (formula && store.description) {
      return (
        <Box>
          <Flex alignItems="center" gap="4px" marginBottom="4px" fontWeight="medium">
            <PiFunctionLight size={14} />
            <span>{formula.expression}</span>
          </Flex>
          <Box color="gray.300">{store.description}</Box>
        </Box>
      )
    }
    if (formula) {
      return (
        <Flex alignItems="center" gap="4px">
          <PiFunctionLight size={14} />
          <span>{formula.expression}</span>
        </Flex>
      )
    }
    if (store.description) {
      return store.description
    }
    return null
  }

  const tooltipContent = getTooltipContent()

  return (
    <Flex height="28px" alignItems="center">
      {tooltipContent ? (
        <Tooltip
          openDelay={350}
          closeDelay={50}
          showArrow
          content={tooltipContent}
          positioning={{
            placement: 'right-end',
          }}
        >
          <Flex alignItems="center" gap="4px" color="newGray.400">
            <Text textDecoration={store.deprecated ? 'line-through' : undefined}>{node.fieldName}:</Text>
            {formula && <PiFunctionLight size={14} />}
          </Flex>
        </Tooltip>
      ) : (
        <Flex alignItems="center" gap="4px" color="newGray.400">
          <Text textDecoration={store.deprecated ? 'line-through' : undefined}>{node.fieldName}:</Text>
          {formula && <PiFunctionLight size={14} />}
        </Flex>
      )}
    </Flex>
  )
})
