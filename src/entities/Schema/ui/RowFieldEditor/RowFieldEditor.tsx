import { Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { PiDotOutlineFill } from 'react-icons/pi'

interface RowFieldEditorProps {
  name?: string
  value?: React.ReactNode
  nameAndValueClassName?: string
  colorName?: string
  onOverLabel?: () => void
  onOutLabel?: () => void
}

export const RowFieldEditor: React.FC<RowFieldEditorProps & React.PropsWithChildren> = ({
  name,
  value,
  children,
  nameAndValueClassName,
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
              {name}:
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
