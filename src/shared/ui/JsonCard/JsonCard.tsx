import { Box, Code } from '@chakra-ui/react'
import React, { useCallback } from 'react'
import { standaloneToast } from 'src/shared/ui'
import { CopyButton } from 'src/shared/ui/CopyButton/CopyButton.tsx'

import styles from './CopyButton.module.scss'

interface JsonCardProps {
  data: unknown
}

export const JsonCard: React.FC<JsonCardProps> = ({ data }) => {
  const text = JSON.stringify(data, null, 3)

  const handleClick = useCallback(async () => {
    const type = 'text/plain'
    const blob = new Blob([text], { type })
    const data = [new ClipboardItem({ [type]: blob })]
    await navigator.clipboard.write(data)

    standaloneToast({
      status: 'success',
      variant: 'subtle',
      icon: false,
      colorScheme: 'gray',
      duration: 1500,
      isClosable: true,
      position: 'top',
      description: 'Copied to clipboard',
    })
  }, [text])

  return (
    <Box width="100%" position="relative" className={styles.JsonCard}>
      <CopyButton
        dataTestId="json-card-copy-button"
        aria-label=""
        position="absolute"
        top="8px"
        right="8px"
        className={styles.CopyButton}
        onClick={handleClick}
      />
      <Code whiteSpace="pre-wrap" backgroundColor="gray.50" padding="24px" width="100%" borderRadius="8px">
        {text}
      </Code>
    </Box>
  )
}
