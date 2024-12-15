import { Box, Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { FC, useCallback } from 'react'
import { UsernamePageModel } from 'src/pages/UsernamePage/model/UsernamePageModel.ts'
import { useViewModel } from 'src/shared/lib'
import { CardInput, Page } from 'src/shared/ui'
import { GrayButton } from 'src/shared/ui/GreyButton/GrayButton.tsx'

export const UsernamePage: FC = observer(() => {
  const model = useViewModel(UsernamePageModel)

  const handleUsername: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      model.form.setValue('username', e.currentTarget.value)
    },
    [model.form],
  )

  const handleEnter = useCallback(async () => {
    await model.submit()
  }, [model])

  return (
    <Page hideSidebar>
      <Flex alignItems="center" justifyContent="center" flex={1}>
        <Flex flexDirection="column" width="16rem" gap="1rem" alignItems="center">
          <CardInput
            dataTestId="login-emailOrUsername-input"
            autoFocus
            height="40px"
            placeholder="set username"
            value={model.form.values.username}
            onChange={handleUsername}
            onEnter={handleEnter}
          />

          <Box visibility={model.disableSubmitButton ? 'hidden' : 'visible'}>
            <GrayButton onClick={handleEnter} isLoading={model.isLoading} title="Set username" />
          </Box>
        </Flex>
      </Flex>
    </Page>
  )
})
