import { Flex, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { Link } from 'react-router-dom'

import { useTableMenuListModel } from 'src/widgets/TableMenuList/hooks/useTableMenuListModel.ts'

export const TableMenuList: React.FC = observer(() => {
  const store = useTableMenuListModel()

  return (
    <VStack alignItems="flex-start" gap="0.25rem" width="100%">
      <Text color="gray" fontSize="sm" mb="0.5rem">
        Tables:
      </Text>
      {store.items.map((table) => (
        <Flex
          _hover={{ backgroundColor: 'gray.200' }}
          alignItems="center"
          backgroundColor={table.isActive ? 'gray.100' : undefined}
          borderRadius="0.25rem"
          height="32px"
          key={table.versionId}
          paddingLeft="0.5rem"
          paddingRight="0.5rem"
          width="100%"
        >
          {table.isActive ? (
            <Text color="gray.500" fontWeight="600" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
              {table.id}
            </Text>
          ) : (
            <Text color="gray.500" fontWeight="600" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
              <Link key={table.id} to={table.link} data-testid={`sidebar-table-${table.id}`}>
                {table.id}
              </Link>
            </Text>
          )}
          {table.touched && <Text color="gray.600">*</Text>}
        </Flex>
      ))}
    </VStack>
  )
})
