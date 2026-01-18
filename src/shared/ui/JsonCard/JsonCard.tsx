import { Box, Flex, Text } from '@chakra-ui/react'
import { githubLight } from '@uiw/codemirror-theme-github'
import CodeMirror, { EditorView } from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import React, { useCallback, useRef, useState } from 'react'
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
  onBlur?: () => void
}

export const JsonCard: React.FC<JsonCardProps> = ({ data, readonly, onChange, schema, onBlur }) => {
  const [error, setError] = useState('')
  const externalText = JSON.stringify(data, null, 3)
  const [internalText, setInternalText] = useState(externalText)
  const isFocusedRef = useRef(false)

  const displayText = isFocusedRef.current ? internalText : externalText

  const handleClick = useCallback(async () => {
    await navigator.clipboard.writeText(displayText)

    toaster.info({
      duration: 1500,
      description: 'Copied to clipboard',
    })
  }, [displayText])

  const handleChange = useCallback(
    (value: string) => {
      setInternalText(value)

      try {
        const parsedData = JSON.parse(value)

        if (schema) {
          const result = isValidData(schema, parsedData)

          if (!result.result) {
            const instancePath = result.errors?.[0]?.instancePath
            const path = instancePath || '/'
            setError(`"${path}": ${result.errors?.[0]?.message}`)
            return
          }
        }

        setError('')
        onChange?.(parsedData)
      } catch (e) {
        console.error(e)
        setError('Invalid JSON')
      }
    },
    [onChange, schema],
  )

  const handleFocus = useCallback(() => {
    isFocusedRef.current = true
    setInternalText(externalText)
  }, [externalText])

  const handleBlur = useCallback(() => {
    isFocusedRef.current = false
    setInternalText(externalText)
    onBlur?.()
  }, [onBlur, externalText])

  return (
    <Flex position="relative" width="100%" flex={1} className={styles.JsonCard} direction="column" gap="1rem">
      <Box p={1} flex={1}>
        <CodeMirror
          value={displayText}
          extensions={[EditorView.lineWrapping, json()]}
          editable={!readonly}
          theme={githubLight}
          maxWidth="100%"
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
          }}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
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
