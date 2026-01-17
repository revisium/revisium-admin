import { Box, Flex, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useMemo, useState } from 'react'
import { container } from 'src/shared/lib'
import { ConfigurationService } from 'src/shared/model/ConfigurationService'
import { CloseButton } from 'src/shared/ui'
import { ContentEditable } from 'src/shared/ui/ContentEditable/ContentEditable.tsx'
import { ObjectNodeStore } from 'src/widgets/SchemaEditor'
import { ArrayNodeStore } from 'src/widgets/SchemaEditor/model/ArrayNodeStore.ts'
import { BooleanNodeStore } from 'src/widgets/SchemaEditor/model/BooleanNodeStore.ts'
import { SchemaNode } from 'src/widgets/SchemaEditor/model/NodeStore.ts'
import { NumberNodeStore } from 'src/widgets/SchemaEditor/model/NumberNodeStore.ts'
import { useSchemaEditor } from 'src/widgets/SchemaEditor/model/SchemaEditorActions.ts'
import { StringNodeStore } from 'src/widgets/SchemaEditor/model/StringNodeStore.ts'
import { FormulaEditor, FormulaEditorViewModel, FormulaNode } from '../FormulaEditor'
import styles from './NodeSettings.module.scss'

function canHaveFormula(node: SchemaNode): node is FormulaNode {
  if (node instanceof StringNodeStore) {
    return node.canHaveFormula
  }
  if (node instanceof NumberNodeStore || node instanceof BooleanNodeStore) {
    return node.canHaveFormula
  }
  return false
}

interface NodeSettingsProps {
  node: SchemaNode
  dataTestId?: string
}

export const NodeSettings: FC<NodeSettingsProps> = observer(({ node, dataTestId }) => {
  const { root } = useSchemaEditor()
  const configurationService = container.get(ConfigurationService)

  const [booleanState, setBooleanState] = useState(Boolean(node.draftDeprecated).toString())

  const handleFormulaChange = useCallback(() => {
    if (node.parent instanceof ObjectNodeStore) {
      root.replaceProperty(node.parent, node, node)
    } else if (node.parent instanceof ArrayNodeStore) {
      root.replaceItems(node.parent, node)
    }
  }, [node, root])

  const formulaEditorViewModel = useMemo(() => {
    if (configurationService.formulaEnabled && canHaveFormula(node) && root.node instanceof ObjectNodeStore) {
      const vm = new FormulaEditorViewModel(node, root.node)
      vm.setOnFormulaChange(handleFormulaChange)
      return vm
    }
    return null
  }, [node, root, configurationService.formulaEnabled, handleFormulaChange])

  const handleTitleChange = useCallback(
    (value: string) => {
      node.setTitle(value.replace('\n', ''))

      if (node.parent instanceof ObjectNodeStore) {
        root.replaceProperty(node.parent, node, node)
      } else if (node.parent instanceof ArrayNodeStore) {
        root.replaceItems(node.parent, node)
      }
    },
    [node, root],
  )

  const handleDescriptionChange = useCallback(
    (value: string) => {
      node.setDescription(value.replace('\n', ''))

      if (node.parent instanceof ObjectNodeStore) {
        root.replaceProperty(node.parent, node, node)
      } else if (node.parent instanceof ArrayNodeStore) {
        root.replaceItems(node.parent, node)
      }
    },
    [node, root],
  )

  const handleBooleanChange = useCallback(
    (value: string) => {
      setBooleanState(value)

      if (node.parent instanceof ObjectNodeStore) {
        root.replaceProperty(node.parent, node, node)
      } else if (node.parent instanceof ArrayNodeStore) {
        root.replaceItems(node.parent, node)
      }
    },
    [node, root],
  )

  const handleBooleanBlur = useCallback(() => {
    const value = booleanState.toLowerCase() === 'false' || booleanState === '0' ? false : Boolean(booleanState)
    setBooleanState(value.toString())
    node.setDeprecated(value)
  }, [booleanState, node])

  return (
    <Flex
      className={styles.NodeSettingsRoot}
      direction="column"
      borderWidth={1}
      m="4px 4px 16px 20px"
      borderColor="gray.200"
      borderStyle="dashed"
      borderRadius="2px"
      p="8px"
      width="100%"
    >
      <Flex>
        <Flex width="100%" direction="column">
          <Flex gap="8px">
            <Text color="gray.400">description:</Text>
            <ContentEditable
              dataTestId={`${dataTestId}-description`}
              prefix='"'
              postfix='"'
              initValue={node.draftDescription ?? ''}
              onChange={handleDescriptionChange}
            />
          </Flex>
          <Flex gap="8px" display="none">
            <Text color="gray.400">title:</Text>
            <ContentEditable
              dataTestId={`${dataTestId}-title`}
              prefix='"'
              postfix='"'
              initValue={node.draftTitle ?? ''}
              onChange={handleTitleChange}
            />
          </Flex>
          <Flex gap="8px">
            <Text color="gray.400">deprecated:</Text>
            <ContentEditable
              dataTestId={`${dataTestId}-deprecated`}
              prefix=""
              postfix=""
              initValue={booleanState}
              onChange={handleBooleanChange}
              onBlur={handleBooleanBlur}
            />
          </Flex>
          {formulaEditorViewModel && (
            <Flex gap="8px" mt="8px" alignItems="flex-start">
              <Text color="gray.400" flexShrink={0}>
                formula:
              </Text>
              <Box flex={1}>
                <FormulaEditor model={formulaEditorViewModel} dataTestId={`${dataTestId}-formula`} />
              </Box>
            </Flex>
          )}
        </Flex>
        <Box className={styles.Actions}>
          <CloseButton height="24px" onClick={node.toggleSettings} />
        </Box>
      </Flex>
    </Flex>
  )
})
