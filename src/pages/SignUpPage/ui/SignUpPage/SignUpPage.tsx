import { Box, Flex, Link as ChakraLink, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { FC, useCallback } from 'react'
import { PiGithubLogoFill, PiGoogleLogoFill } from 'react-icons/pi'
import { Link } from 'react-router-dom'
import { SignUpViewModel } from 'src/pages/SignUpPage/model/SignUpViewModel.ts'
import { LOGIN_ROUTE } from 'src/shared/config/routes.ts'
import { useViewModel } from 'src/shared/lib'
import { CardInput, Page } from 'src/shared/ui'
import { GrayButton } from 'src/shared/ui/GreyButton/GrayButton.tsx'

export const SignUpPage: FC = observer(() => {
  const model = useViewModel(SignUpViewModel)

  const handleChangeUsername: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      model.form.setValue('username', e.currentTarget.value)
    },
    [model.form],
  )

  const handleChangeEmail: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      model.form.setValue('email', e.currentTarget.value)
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
      <Flex width="100%" gap="8px" justifyContent="flex-end">
        <Text color="gray.300">Already have an account?</Text>
        <ChakraLink color="gray.300" alignSelf="center" as={Link} to={`/${LOGIN_ROUTE}`}>
          Log in
        </ChakraLink>
      </Flex>
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
              {model.availableEmailSignUp && (
                <Flex width="100%" alignItems="center" gap="16px">
                  <Box backgroundColor="gray.100" flex={1} height="1px" />
                  <Text color="gray.300" fontSize="12px">
                    OR
                  </Text>
                  <Box backgroundColor="gray.100" flex={1} height="1px" />
                </Flex>
              )}
            </>
          )}
          {model.availableEmailSignUp && (
            <>
              <CardInput
                dataTestId="signup-username-input"
                autoFocus
                height="40px"
                placeholder="enter your username"
                autoComplete="new-password"
                value={model.form.values.username}
                onChange={handleChangeUsername}
              />
              <CardInput
                dataTestId="signup-email-input"
                height="40px"
                placeholder="enter your email"
                type="email"
                autoComplete="new-password"
                value={model.form.values.email}
                onChange={handleChangeEmail}
              />
              <CardInput
                dataTestId="signup-password-input"
                height="40px"
                placeholder="create a password"
                type="password"
                autoComplete="new-password"
                value={model.form.values.password}
                onChange={handleChangePassword}
                onEnter={handleEnter}
              />
              <Box visibility={model.disableSubmitButton ? 'hidden' : 'visible'}>
                <GrayButton
                  onClick={handleEnter}
                  isDisabled={model.disableSubmitButton}
                  isLoading={model.isLoading}
                  title="Sign up"
                />
              </Box>
            </>
          )}
        </Flex>
      </Flex>
    </Page>
  )
})
