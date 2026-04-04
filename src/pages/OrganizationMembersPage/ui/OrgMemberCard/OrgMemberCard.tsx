import { Box, Button, Flex, HStack, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { PiTrashLight, PiUserLight } from 'react-icons/pi'
import { OrgMemberItemViewModel } from 'src/pages/OrganizationMembersPage/model/OrgMemberItemViewModel.ts'

interface OrgMemberCardProps {
  model: OrgMemberItemViewModel
}

export const OrgMemberCard: FC<OrgMemberCardProps> = observer(({ model }) => {
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
          <Text fontSize="sm" color="newGray.500" minWidth="80px">
            {model.roleName}
          </Text>

          {model.canRemove && (
            <Button variant="ghost" size="sm" color="red.500" onClick={() => model.remove()} loading={model.isRemoving}>
              <PiTrashLight />
            </Button>
          )}
        </HStack>
      </Flex>
    </Box>
  )
})
