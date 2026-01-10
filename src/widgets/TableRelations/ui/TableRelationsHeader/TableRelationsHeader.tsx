import { Box, Flex, HoverCard, HStack, Icon, Portal, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { PiInfoLight, PiWarningCircleLight } from 'react-icons/pi'

interface TableRelationsHeaderProps {
  branchName: string
  tablesCount: number
  relationsCount: number
}

export const TableRelationsHeader: FC<TableRelationsHeaderProps> = observer(
  ({ branchName, tablesCount, relationsCount }) => {
    return (
      <Box mb={6} position="sticky" top={0} bg="white" zIndex={10} pt={4} pb={2}>
        <HStack justify="space-between" align="flex-start" mb={1}>
          <Text fontSize="20px" fontWeight="600" color="newGray.500">
            Table Relations for {branchName} ({tablesCount} tables, {relationsCount} relations)
          </Text>
        </HStack>

        <HStack gap={1} mb={4}>
          <Text fontSize="xs" color="newGray.400">
            Visual map of foreign key relationships between tables in this revision.
          </Text>
          <HoverCard.Root openDelay={200} closeDelay={100}>
            <HoverCard.Trigger>
              <Icon as={PiInfoLight} color="newGray.400" cursor="help" />
            </HoverCard.Trigger>
            <Portal>
              <HoverCard.Positioner>
                <HoverCard.Content maxWidth="400px" p={3}>
                  <HoverCard.Arrow>
                    <HoverCard.ArrowTip />
                  </HoverCard.Arrow>
                  <VStack align="start" gap={3}>
                    <Text fontSize="xs" color="newGray.600" fontWeight="600">
                      About Table Relations
                    </Text>
                    <Text fontSize="xs" color="newGray.600">
                      This graph shows how tables are connected through foreign key fields. An arrow from table A to
                      table B means A has a field that references rows in B.
                    </Text>
                    <VStack align="start" gap={1}>
                      <Text fontSize="xs" color="newGray.500" fontWeight="500">
                        Creating relations:
                      </Text>
                      <Text fontSize="xs" color="newGray.500">
                        • Open table schema editor and add a new field
                      </Text>
                      <Text fontSize="xs" color="newGray.500">
                        • Set field type to "Foreign Key" and select the target table
                      </Text>
                      <Text fontSize="xs" color="newGray.500">
                        • The field will store row IDs from the referenced table
                      </Text>
                    </VStack>
                    <Flex align="start" gap={2} p={2} bg="orange.50" borderRadius="md" width="100%">
                      <Icon as={PiWarningCircleLight} color="orange.500" boxSize={4} flexShrink={0} mt="1px" />
                      <VStack align="start" gap={0}>
                        <Text fontSize="xs" color="orange.600">
                          Self-references are not supported yet
                        </Text>
                        <Text fontSize="xs" color="orange.600">
                          Empty values (optional references) are not supported yet
                        </Text>
                      </VStack>
                    </Flex>
                    <VStack align="start" gap={1}>
                      <Text fontSize="xs" color="newGray.500" fontWeight="500">
                        Example schema:
                      </Text>
                      <Box
                        as="pre"
                        fontSize="10px"
                        color="newGray.500"
                        bg="gray.50"
                        p={2}
                        borderRadius="sm"
                        width="100%"
                        overflow="auto"
                      >
                        {`{
  "categoryId": {
    "type": "string",
    "default": "",
    "foreignKey": "categories"
  }
}`}
                      </Box>
                    </VStack>
                    <VStack align="start" gap={1}>
                      <Text fontSize="xs" color="newGray.500" fontWeight="500">
                        Interactions:
                      </Text>
                      <Text fontSize="xs" color="newGray.500">
                        • Hover over a table to highlight its connections
                      </Text>
                      <Text fontSize="xs" color="newGray.500">
                        • Click a table to keep it selected
                      </Text>
                      <Text fontSize="xs" color="newGray.500">
                        • Use mouse wheel to zoom, drag to pan
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
  },
)
