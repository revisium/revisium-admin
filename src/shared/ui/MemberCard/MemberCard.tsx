import { Box, Button, Flex, HStack, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, ReactNode } from 'react'
import { PiTrashLight, PiUserLight } from 'react-icons/pi'

export interface IMemberCardModel {
  id: string
  displayName: string
  username: string | null
  email: string | null
  canRemove: boolean
  isRemoving: boolean
  remove(): Promise<void>
}

interface MemberCardProps {
  model: IMemberCardModel
  roleSlot: ReactNode
  disableRemove?: boolean
}

export const MemberCard: FC<MemberCardProps> = observer(({ model, roleSlot, disableRemove }) => {
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
          {roleSlot}

          {model.canRemove && (
            <Button
              variant="ghost"
              size="sm"
              color="red.500"
              onClick={() => model.remove()}
              loading={model.isRemoving}
              disabled={disableRemove}
            >
              <PiTrashLight />
            </Button>
          )}
        </HStack>
      </Flex>
    </Box>
  )
})
