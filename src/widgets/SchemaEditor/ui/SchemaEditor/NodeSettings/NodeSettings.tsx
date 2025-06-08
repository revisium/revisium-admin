import { Box, Flex, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useState } from 'react'
import { CloseButton } from 'src/shared/ui'
import { ContentEditable } from 'src/shared/ui/ContentEditable/ContentEditable.tsx'
import { SchemaNode } from 'src/widgets/SchemaEditor/model/NodeStore.ts'
import styles from './NodeSettings.module.scss'

interface NodeSettingsProps {
  node: SchemaNode
  dataTestId?: string
}

export const NodeSettings: FC<NodeSettingsProps> = observer(({ node, dataTestId }) => {
  const [booleanState, setBooleanState] = useState(Boolean(node.draftDeprecated).toString())

  const handleTitleChange = useCallback(
    (value: string) => {
      node.setTitle(value.replace('\n', ''))
    },
    [node],
  )

  const handleDescriptionChange = useCallback(
    (value: string) => {
      node.setDescription(value.replace('\n', ''))
    },
    [node],
  )

  const handleBooleanChange = useCallback((value: string) => {
    setBooleanState(value)
  }, [])

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
            <Text color="gray.400">description:</Text>
            <ContentEditable
              dataTestId={`${dataTestId}-description`}
              prefix='"'
              postfix='"'
              initValue={node.draftDescription ?? ''}
              onChange={handleDescriptionChange}
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
        </Flex>
        <Box className={styles.Actions}>
          <CloseButton height="24px" onClick={node.toggleSettings} />
        </Box>
      </Flex>
    </Flex>
  )
})
