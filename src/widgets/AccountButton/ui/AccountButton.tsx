import { Button } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { PiUserLight } from 'react-icons/pi'
import { AccountSettingsDialog, AccountSettingsViewModel } from 'src/features/AccountSettings'
import { useViewModel } from 'src/shared/lib/hooks/useViewModel.ts'

export const AccountButton: FC = observer(() => {
  const model = useViewModel(AccountSettingsViewModel)

  return (
    <>
      <Button variant="ghost" size="sm" color="gray.400" onClick={model.open}>
        <PiUserLight />
        {model.username || 'Account'}
      </Button>
      <AccountSettingsDialog model={model} />
    </>
  )
})
