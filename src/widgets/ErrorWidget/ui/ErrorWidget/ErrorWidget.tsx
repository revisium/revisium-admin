import { Flex, Text } from '@chakra-ui/react'
import { useMemo } from 'react'
import { PiWarningThin } from 'react-icons/pi'
import { useRouteError } from 'react-router-dom'

export const ErrorWidget = () => {
  const error = useRouteError()

  const text = useMemo(() => {
    console.error(error)

    return 'Unexpected error'
  }, [error])

  return (
    <Flex alignItems="center" flex={1} gap="1rem" justifyContent="center" width="100%" height="100%">
      <PiWarningThin color="gray" />
      <Text color="gray.400">{text}</Text>
    </Flex>
  )
}
