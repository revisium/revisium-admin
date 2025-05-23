import { Box, Flex, Text, Tooltip } from '@chakra-ui/react'
import { ColorProps } from '@chakra-ui/styled-system'
import React from 'react'
import { PiDotOutlineFill } from 'react-icons/pi'

interface RowFieldEditorProps {
  name?: string
  value?: React.ReactNode
  nameAndValueClassName?: string
  title?: string
  description?: string
  colorName?: ColorProps['color']
  onOverLabel?: () => void
  onOutLabel?: () => void
}

export const RowFieldEditor: React.FC<RowFieldEditorProps & React.PropsWithChildren> = ({
  name,
  value,
  children,
  nameAndValueClassName,
  title,
  description,
  colorName,
  onOverLabel,
  onOutLabel,
}) => {
  if (name === undefined && value === undefined) {
    return (
      <Flex flexDirection="column" width="100%">
        {children}
      </Flex>
    )
  }

  return (
    <Flex flexDirection="column" flex={1} width="100%">
      <Flex gap="4px" minHeight="28px" alignItems="flex-start" onMouseOver={onOverLabel} onMouseOut={onOutLabel}>
        <Flex color="gray.300" height="28px" alignItems="center">
          <PiDotOutlineFill />
        </Flex>
        {name ? (
          <Flex className={nameAndValueClassName} flex={1}>
            <Text color={colorName} fontWeight="300">
              {description ? (
                <Tooltip hasArrow placement="right" label={description}>
                  {title ?? name}
                </Tooltip>
              ) : (
                title ?? name
              )}
              :
            </Text>
            <Flex gap="4px" flex={1}>
              {value}
            </Flex>
          </Flex>
        ) : (
          <Flex className={nameAndValueClassName}>
            <Text>{value}</Text>
            <Box>:</Box>
          </Flex>
        )}
      </Flex>
      {children && (
        <Box
          ml="7px"
          pl="18px"
          borderLeftWidth={1}
          borderLeftStyle="solid"
          borderLeftColor="white"
          _hover={{
            borderLeftColor: 'blackAlpha.200',
          }}
        >
          {children}
        </Box>
      )}
    </Flex>
  )
}
