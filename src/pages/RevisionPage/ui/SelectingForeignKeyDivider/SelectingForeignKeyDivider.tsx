import { Box, Flex } from '@chakra-ui/react'

export const SelectingForeignKeyDivider = () => {
  return (
    <Flex
      width="100%"
      borderStyle="solid"
      borderTopWidth={1}
      borderColor="gray.100"
      justifyContent="center"
      color="gray.400"
      fontWeight="300"
      pt="0.5rem"
      pb="0.5rem"
    >
      <Box backgroundColor="gray.50" pl="5px" pr="5px" borderRadius="5px">
        Select or create a table to be referenced by the above table
      </Box>
    </Flex>
  )
}
