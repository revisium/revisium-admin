import { Box, Button, Flex, HStack, Spinner, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { PiTrashLight, PiUserLight } from 'react-icons/pi'
import { UserItemViewModel } from 'src/pages/UsersPage/model/UserItemViewModel.ts'
import { RoleSelect } from '../RoleSelect'

interface UserCardProps {
  model: UserItemViewModel
}

export const UserCard: FC<UserCardProps> = observer(({ model }) => {
  return (
    <Box
      borderWidth="1px"
      borderColor="newGray.200"
      borderRadius="md"
      padding="1rem"
      backgroundColor="white"
      _hover={{ borderColor: 'newGray.300' }}
      transition="border-color 0.2s"
    >
      <Flex justify="space-between" align="center">
        <HStack gap={3}>
          <Box color="newGray.400">
            <PiUserLight size={20} />
          </Box>
          <Box>
            <Text fontWeight="500" color="newGray.600">
              {model.displayName}
            </Text>
            {model.username && model.email && (
              <Text fontSize="xs" color="newGray.400">
                {model.email}
              </Text>
            )}
          </Box>
        </HStack>

        <HStack gap={3}>
          {model.isUpdating && <Spinner size="sm" />}

          {model.canUpdateRole ? (
            <RoleSelect value={model.roleId} onChange={(role) => model.updateRole(role)} disabled={model.isUpdating} />
          ) : (
            <Text fontSize="sm" color="newGray.500" minWidth="80px">
              {model.roleName}
            </Text>
          )}

          {model.canRemove && (
            <Button
              variant="ghost"
              size="sm"
              color="red.500"
              onClick={() => model.remove()}
              loading={model.isRemoving}
              disabled={model.isUpdating}
            >
              <PiTrashLight />
            </Button>
          )}
        </HStack>
      </Flex>
    </Box>
  )
})
