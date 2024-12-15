import { Box, Code, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { PiWarningThin } from 'react-icons/pi'
import { useLocalStorage } from 'react-use'
import { ViewerSwitcherMode } from 'src/entities/Schema'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import styles from 'src/entities/Schema/ui/RowDataCard/RowDataCard.module.scss'
import { RowViewerSwitcher } from 'src/entities/Schema/ui/RowViewerSwitcher/RowViewerSwitcher.tsx'

const MODE_KEY = 'row-edit-mode'

interface UnsupportedSchemaForRow {
  data: JsonValue
}

export const UnsupportedSchemaForRow: React.FC<UnsupportedSchemaForRow> = ({ data }) => {
  const [mode, setMode] = useLocalStorage(MODE_KEY, ViewerSwitcherMode.Tree)

  return (
    <Flex alignItems="flex-start" flexDirection="column" gap="1rem" className={styles.Root} flex={1}>
      <Flex justifyContent="space-between" width="100%" alignItems="center">
        <Flex minHeight="40px" />
        <Box className={styles.Actions}>
          <RowViewerSwitcher mode={mode || ViewerSwitcherMode.Tree} onChange={setMode} />
        </Box>
      </Flex>
      {mode === ViewerSwitcherMode.Tree && (
        <Flex alignItems="center" flex={1} gap="1rem" justifyContent="center" width="100%">
          <PiWarningThin color="gray" />
          <Text color="gray.400">Unsupported schema, use JSON mode</Text>
        </Flex>
      )}
      {mode === ViewerSwitcherMode.Json && (
        <Code whiteSpace="pre-wrap" backgroundColor="gray.50" padding="1rem" paddingRight="5rem">
          {JSON.stringify(data, null, 4)}
        </Code>
      )}
    </Flex>
  )
}
