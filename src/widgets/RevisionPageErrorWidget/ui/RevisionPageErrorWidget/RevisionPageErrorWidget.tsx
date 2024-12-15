import { Flex, Text } from '@chakra-ui/react'
import { useMemo } from 'react'
import { PiWarningThin } from 'react-icons/pi'
import { useRouteError } from 'react-router-dom'
import { NotFoundRow } from 'src/shared/errors/NotFoundRow.ts'
import { NotFoundTable } from 'src/shared/errors/NotFoundTable.ts'

export const RevisionPageErrorWidget = () => {
  const error = useRouteError()

  const text = useMemo(() => {
    if (error instanceof NotFoundTable) {
      return `Not found table "${error.message}" in this revision`
    } else if (error instanceof NotFoundRow) {
      return `Not found row "${error.message}" in this revision`
    }
    console.error(error)

    return 'Unexpected error'
  }, [error])

  return (
    <Flex alignItems="center" flex={1} gap="1rem" justifyContent="center" width="100%">
      <PiWarningThin color="gray" />
      <Text color="gray.400">{text}</Text>
    </Flex>
  )
}
