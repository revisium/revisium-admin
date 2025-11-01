import { Box, Flex, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
import { useLinkMaker } from 'src/entities/Navigation/hooks/useLinkMaker.ts'

export const ReadonlyBanner = observer(() => {
  const linkMaker = useLinkMaker()
  const draftLink = linkMaker.make({ isDraft: true })

  return (
    <Box
      borderTop="1px solid"
      borderTopColor="gray.100"
      position="sticky"
      bottom="0"
      paddingX="4px"
      paddingY="4px"
      marginTop="auto"
    >
      <Flex alignItems="center" justifyContent="center" gap="16px">
        <Text color="newGray.600">You are viewing a read-only revision</Text>
        <Text color="newGray.400" textDecoration="underline">
          <Link to={draftLink}>Go to draft revision</Link>
        </Text>
      </Flex>
    </Box>
  )
})
