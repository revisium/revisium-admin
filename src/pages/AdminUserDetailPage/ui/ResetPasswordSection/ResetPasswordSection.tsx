import { Box, Button, Flex, Input, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { AdminUserDetailViewModel } from '../../model/AdminUserDetailViewModel'

interface ResetPasswordSectionProps {
  model: AdminUserDetailViewModel
}

export const ResetPasswordSection: FC<ResetPasswordSectionProps> = observer(({ model }) => {
  return (
    <Box padding="16px" borderWidth="1px" borderColor="newGray.100" borderRadius="md" marginTop="16px">
      <Text fontSize="sm" fontWeight="500" color="newGray.500" marginBottom="12px">
        Reset Password
      </Text>
      <Flex gap="12px" alignItems="flex-start">
        <Input
          placeholder="New password (min 6 characters)"
          type="password"
          size="sm"
          value={model.newPassword}
          onChange={(e) => model.setNewPassword(e.target.value)}
          maxWidth="300px"
        />
        <Button
          size="sm"
          colorPalette="gray"
          onClick={model.resetPassword}
          disabled={!model.canResetPassword}
          loading={model.isResetPasswordLoading}
        >
          Reset
        </Button>
      </Flex>
      {model.resetPasswordError && (
        <Text fontSize="sm" color="red.500" marginTop="8px">
          {model.resetPasswordError}
        </Text>
      )}
      {model.resetPasswordSuccess && (
        <Text fontSize="sm" color="green.500" marginTop="8px">
          Password has been reset successfully
        </Text>
      )}
    </Box>
  )
})
