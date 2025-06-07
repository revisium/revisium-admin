import { Flex, Text } from '@chakra-ui/react'
import React, { useCallback } from 'react'

interface RowListItemProps {
  row: { id: string; versionId: string; data: string }
  onSelect: (rowId: string) => void
}

export const RowListItem: React.FC<RowListItemProps> = ({ row, onSelect }) => {
  const handleClickOnRowId = useCallback(() => {
    onSelect?.(row.id)
  }, [onSelect, row.id])

  return (
    <Flex
      _hover={{ backgroundColor: 'gray.50' }}
      alignItems="center"
      key={row.versionId}
      gap="4px"
      paddingLeft="1rem"
      minHeight="2.5rem"
      width="100%"
    >
      <Flex minWidth="150px">
        <Text textDecoration="underline" cursor="pointer" onClick={handleClickOnRowId}>
          {row.id}
        </Text>
      </Flex>

      <Flex alignItems="center" justifyContent="space-between" minHeight="40px" width="100%" minWidth={0}>
        <Text ml="16px" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" color="gray.400">
          {row.data}
        </Text>
      </Flex>
    </Flex>
  )
}
