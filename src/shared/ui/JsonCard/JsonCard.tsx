import { Box, Flex, Text } from '@chakra-ui/react'
import * as themes from '@uiw/codemirror-themes-all'
import CodeMirror, { EditorView } from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import React, { useCallback, useState } from 'react'
import { JsonSchema } from 'src/entities/Schema'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { isValidData } from 'src/shared/schema/isValidSchema.ts'
import { toaster } from 'src/shared/ui'
import { CopyButton } from 'src/shared/ui/CopyButton/CopyButton.tsx'

import styles from './CopyButton.module.scss'

interface JsonCardProps {
  data: JsonValue
  schema?: JsonSchema
  readonly?: boolean
  onChange?: (data: JsonValue) => void
}

export const JsonCard: React.FC<JsonCardProps> = ({ data, readonly, onChange, schema }) => {
  const [error, setError] = useState('')
  const text = JSON.stringify(data, null, 3)

  const handleClick = useCallback(async () => {
    await navigator.clipboard.writeText(text)

    toaster.info({
      duration: 1500,
      description: 'Copied to clipboard',
    })
  }, [text])

  const handleChange = useCallback(
    (value: string) => {
      try {
        const data = JSON.parse(value)
        onChange?.(data)

        if (schema) {
          const result = isValidData(schema, data)

          if (!result.result) {
            const instancePath = result.errors?.[0]?.instancePath
            const path = instancePath ? instancePath : '/'
            setError(`"${path}": ${result.errors?.[0]?.message}`)
            return
          }
        }

        setError('')
        onChange?.(data)
      } catch (e) {
        console.error(e)
        setError('Invalid JSON')
      }
    },
    [onChange, schema],
  )

  return (
    <Flex position="relative" width="100%" flex={1} className={styles.JsonCard} direction="column" gap="1rem">
      <Box p={1} flex={1}>
        <CodeMirror
          value={text}
          extensions={[EditorView.lineWrapping, json()]}
          editable={!readonly}
          theme={themes.githubLight}
          maxWidth="100%"
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
          }}
          onChange={handleChange}
        />
        <CopyButton
          dataTestId="json-card-copy-button"
          aria-label=""
          position="absolute"
          top="8px"
          right="8px"
          className={styles.CopyButton}
          onClick={handleClick}
        />
      </Box>
      <Flex
        height="40px"
        paddingBottom="8px"
        alignItems="flex-end"
        backgroundColor="white"
        width="100%"
        position="sticky"
        bottom={0}
        justifyContent="center"
      >
        <Text color="gray">{error}</Text>
      </Flex>
    </Flex>
  )
}
