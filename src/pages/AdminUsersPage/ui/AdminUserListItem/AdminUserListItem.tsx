import { Box, Flex, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { Link } from 'react-router-dom'
import { AdminUserItemViewModel } from '../../model/AdminUserItemViewModel'

interface AdminUserListItemProps {
  model: AdminUserItemViewModel
}

export const AdminUserListItem: FC<AdminUserListItemProps> = observer(({ model }) => {
  return (
    <Box height="2.5rem" width="100%">
      <Link to={model.link} style={{ textDecoration: 'none', width: '100%' }}>
        <Flex _hover={{ backgroundColor: 'gray.50' }} alignItems="center" gap="4px" paddingLeft="1rem" height="100%">
          <Flex width="200px">
            <Text
              maxWidth="190px"
              textDecoration="underline"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              overflow="hidden"
            >
              {model.username || model.email || 'No username'}
            </Text>
          </Flex>
          <Flex alignItems="center" flex={1} minHeight="40px">
            <Text color="gray.400" fontWeight="300" ml="16px">
              {model.roleName || '-'}
            </Text>
          </Flex>
        </Flex>
      </Link>
    </Box>
  )
})
