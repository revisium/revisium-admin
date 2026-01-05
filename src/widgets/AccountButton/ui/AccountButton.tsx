import { Box, Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { PiUserLight } from 'react-icons/pi'
import { AccountSettingsDialog, AccountSettingsViewModel } from 'src/features/AccountSettings'
import { useViewModel } from 'src/shared/lib/hooks/useViewModel.ts'

export const AccountButton: FC = observer(() => {
  const model = useViewModel(AccountSettingsViewModel)

  return (
    <>
      <Flex
        alignItems="center"
        backgroundColor="transparent"
        _hover={{ backgroundColor: 'newGray.100' }}
        borderRadius="8px"
        height="36px"
        paddingX="8px"
        width="100%"
        color="newGray.600"
        fontWeight="400"
        fontSize="14px"
        minWidth="0"
        cursor="pointer"
        gap="12px"
        userSelect="none"
        onClick={model.open}
      >
        <Box fontSize="20px" color="newGray.400">
          <PiUserLight />
        </Box>
        <Box flex="1" minWidth="0" textOverflow="ellipsis" whiteSpace="nowrap" overflow="hidden">
          Account Settings
        </Box>
      </Flex>
      <AccountSettingsDialog model={model} />
    </>
  )
})
