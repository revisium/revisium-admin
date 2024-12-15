import { Box, Flex, Link as ChakraLink, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { FC, useCallback } from 'react'
import { PiGithubLogoFill, PiGoogleLogoFill } from 'react-icons/pi'
import { Link } from 'react-router-dom'
import { LoginViewModel } from 'src/pages/LoginPage/model/LoginViewModel.ts'
import { SIGN_UP_ROUTE } from 'src/shared/config/routes.ts'
import { useViewModel } from 'src/shared/lib'
import { CardInput, Page } from 'src/shared/ui'
import { GrayButton } from 'src/shared/ui/GreyButton/GrayButton.tsx'

export const LoginPage: FC = observer(() => {
  const model = useViewModel(LoginViewModel)

  const handleChangeEmailOrUsername: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      model.form.setValue('emailOrUsername', e.currentTarget.value)
    },
    [model.form],
  )

  const handleChangePassword: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      model.form.setValue('password', e.currentTarget.value)
    },
    [model.form],
  )

  const handleEnter = useCallback(async () => {
    await model.submit()
  }, [model])

  const handleGithub = useCallback(() => {
    model.toGithubOauth()
  }, [model])

  const handleGoogle = useCallback(() => {
    model.toGoogleOauth()
  }, [model])

  return (
    <Page hideSidebar>
      {model.availableSignUp && (
        <Flex width="100%" gap="8px" justifyContent="flex-end">
          <Text color="gray.300">New to Revisium?</Text>
          <ChakraLink color="gray.300" alignSelf="center" as={Link} to={`/${SIGN_UP_ROUTE}`}>
            Sign up
          </ChakraLink>
        </Flex>
      )}
      <Flex alignItems="center" justifyContent="center" flex={1}>
        <Flex flexDirection="column" width="16rem" gap="1rem" alignItems="center">
          {model.availableOauth && (
            <>
              <Flex flexDirection="column" gap="2px">
                {model.availableGithubOauth && (
                  <GrayButton icon={<PiGithubLogoFill />} onClick={handleGithub} title="Continue with Github" />
                )}
                {model.availableGoogleOauth && (
                  <GrayButton icon={<PiGoogleLogoFill />} onClick={handleGoogle} title="Continue with Google" />
                )}
              </Flex>
              <Flex width="100%" alignItems="center" gap="16px">
                <Box backgroundColor="gray.100" flex={1} height="1px" />
                <Text color="gray.300" fontSize="12px">
                  OR
                </Text>
                <Box backgroundColor="gray.100" flex={1} height="1px" />
              </Flex>
            </>
          )}
          <CardInput
            dataTestId="login-emailOrUsername-input"
            autoFocus
            height="40px"
            placeholder="username or email"
            value={model.form.values.emailOrUsername}
            onChange={handleChangeEmailOrUsername}
            onEnter={handleEnter}
          />
          <CardInput
            dataTestId="login-password-input"
            height="40px"
            placeholder="password"
            type="password"
            value={model.form.values.password}
            onChange={handleChangePassword}
            onEnter={handleEnter}
          />

          <Box visibility={model.disableSubmitButton ? 'hidden' : 'visible'}>
            <GrayButton onClick={handleEnter} isLoading={model.isLoading} title="Login" />
          </Box>
        </Flex>
      </Flex>
    </Page>
  )
})
