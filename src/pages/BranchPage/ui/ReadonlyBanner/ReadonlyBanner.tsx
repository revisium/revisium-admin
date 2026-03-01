import { Flex, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
import { useLinkMaker } from 'src/entities/Navigation/hooks/useLinkMaker.ts'
import { DRAFT_TAG } from 'src/shared/config/routes.ts'

export const ReadonlyBanner = observer(() => {
  const linkMaker = useLinkMaker()
  const draftLink = linkMaker.make({ revisionIdOrTag: DRAFT_TAG })

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      gap="4px"
      paddingY="8px"
      paddingX="4px"
      backgroundColor="newGray.50"
      borderRadius="6px"
      position="sticky"
      top={0}
      zIndex={4}
    >
      <Text color="newGray.400" fontSize="16px" fontWeight="400">
        You are viewing a read-only revision
      </Text>
      <Link to={draftLink}>
        <Text color="newGray.500" fontSize="16px" fontWeight="500" textDecoration="underline">
          Go to draft revision
        </Text>
      </Link>
    </Flex>
  )
})
