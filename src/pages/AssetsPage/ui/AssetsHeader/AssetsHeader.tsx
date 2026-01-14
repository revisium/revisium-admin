import { Box, HoverCard, HStack, Icon, Portal, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { PiInfoLight } from 'react-icons/pi'

interface AssetsHeaderProps {
  branchName: string
  tablesCount: number
  filesCount: number
}

export const AssetsHeader: FC<AssetsHeaderProps> = observer(({ branchName, tablesCount, filesCount }) => {
  return (
    <Box pt={4} pb={2}>
      <HStack justify="space-between" align="flex-start" mb={1}>
        <Text fontSize="20px" fontWeight="600" color="newGray.500">
          Assets for {branchName} ({tablesCount} tables, {filesCount} files)
        </Text>
      </HStack>

      <HStack gap={1}>
        <Text fontSize="xs" color="newGray.400">
          Browse files from your tables. Files can be created as slots and uploaded later.
        </Text>
        <HoverCard.Root openDelay={200} closeDelay={100}>
          <HoverCard.Trigger>
            <Icon as={PiInfoLight} color="newGray.400" cursor="help" />
          </HoverCard.Trigger>
          <Portal>
            <HoverCard.Positioner>
              <HoverCard.Content maxWidth="320px" p={3}>
                <HoverCard.Arrow>
                  <HoverCard.ArrowTip />
                </HoverCard.Arrow>
                <VStack align="start" gap={3}>
                  <Text fontSize="xs" color="newGray.600" fontWeight="600">
                    About files in Revisium
                  </Text>
                  <VStack align="start" gap={1}>
                    <Text fontSize="xs" color="newGray.500" fontWeight="500">
                      File types in schema:
                    </Text>
                    <Text fontSize="xs" color="newGray.500">
                      • Single file field
                    </Text>
                    <Text fontSize="xs" color="newGray.500">
                      • Array of files
                    </Text>
                    <Text fontSize="xs" color="newGray.500">
                      • Files in objects or arrays of objects
                    </Text>
                  </VStack>
                  <VStack align="start" gap={1}>
                    <Text fontSize="xs" color="newGray.500" fontWeight="500">
                      How to add files:
                    </Text>
                    <Text fontSize="xs" color="newGray.500">
                      Add a File field to your table schema, then create or update rows — file slots will be created
                      automatically. Upload actual files via this page or row editor.
                    </Text>
                  </VStack>
                </VStack>
              </HoverCard.Content>
            </HoverCard.Positioner>
          </Portal>
        </HoverCard.Root>
      </HStack>
    </Box>
  )
})
