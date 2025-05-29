import { Box, Flex, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useCallback } from 'react'
import { PiDotOutlineFill } from 'react-icons/pi'
import { StringForeignKeyNodeStore } from 'src/widgets/SchemaEditor/model/StringForeignKeyNodeStore.ts'
import { useSchemaEditor } from 'src/widgets/SchemaEditor/model/SchemaEditorActions.ts'

interface ForeignKeyEditorProps {
  node: StringForeignKeyNodeStore
  dataTestId?: string
}

export const StringForeignKeyNode: React.FC<ForeignKeyEditorProps> = observer(({ node, dataTestId }) => {
  const actions = useSchemaEditor()

  const handleClick = useCallback(() => {
    actions.onSelectForeignKey(node)
  }, [actions, node])

  return (
    <Flex gap="4px" alignItems="center" height="30px" mt="2px" mb="2px">
      <Box color="gray.300">
        <PiDotOutlineFill />
      </Box>
      <Flex
        gap="0.5rem"
        width="100%"
        justifyContent="flex-start"
        outline={0}
        _hover={{
          textDecoration: 'underline',
          textDecorationColor: 'gray.300',
        }}
        onClick={handleClick}
      >
        <Text color="gray.300" cursor="pointer" data-testid={`${dataTestId}-connect-foreign-key`}>
          {node.draftForeignKey || '<Connect table>'}
        </Text>
      </Flex>
    </Flex>
  )
})
