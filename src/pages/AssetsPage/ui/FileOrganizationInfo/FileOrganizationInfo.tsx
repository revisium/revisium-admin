import { Code, HoverCard, Icon, Portal, Text, VStack } from '@chakra-ui/react'
import { FC } from 'react'
import { PiInfoLight } from 'react-icons/pi'

export const FileOrganizationInfo: FC = () => {
  return (
    <HoverCard.Root openDelay={200} closeDelay={100}>
      <HoverCard.Trigger>
        <Icon as={PiInfoLight} color="newGray.400" cursor="help" />
      </HoverCard.Trigger>
      <Portal>
        <HoverCard.Positioner>
          <HoverCard.Content maxWidth="380px" p={3}>
            <HoverCard.Arrow>
              <HoverCard.ArrowTip />
            </HoverCard.Arrow>
            <VStack align="start" gap={3}>
              <Text fontSize="xs" color="newGray.600" fontWeight="600">
                File organization options
              </Text>
              <VStack align="start" gap={1}>
                <Text fontSize="xs" color="newGray.500" fontWeight="500">
                  1. Embedded files (recommended):
                </Text>
                <Text fontSize="xs" color="newGray.500">
                  Embed files directly in table schemas at any nesting level. Best for simpler queries and when files
                  belong to specific rows.
                </Text>
              </VStack>
              <VStack align="start" gap={1}>
                <Text fontSize="xs" color="newGray.500" fontWeight="500">
                  2. Dedicated media table:
                </Text>
                <Text fontSize="xs" color="newGray.500">
                  Create a separate table for files and reference via foreignKey. Use when you need to share the same
                  file across multiple rows.
                </Text>
              </VStack>
              <VStack align="start" gap={1}>
                <Text fontSize="xs" color="newGray.500" fontWeight="500">
                  JSON path examples:
                </Text>
                <VStack align="start" gap={0.5}>
                  <Text fontSize="xs" color="newGray.500">
                    •{' '}
                    <Code fontSize="xs" colorPalette="gray">
                      (root)
                    </Code>{' '}
                    — file at root level
                  </Text>
                  <Text fontSize="xs" color="newGray.500">
                    •{' '}
                    <Code fontSize="xs" colorPalette="gray">
                      avatar
                    </Code>{' '}
                    — single file field
                  </Text>
                  <Text fontSize="xs" color="newGray.500">
                    •{' '}
                    <Code fontSize="xs" colorPalette="gray">
                      gallery[0]
                    </Code>{' '}
                    — array element
                  </Text>
                  <Text fontSize="xs" color="newGray.500">
                    •{' '}
                    <Code fontSize="xs" colorPalette="gray">
                      profile.photo
                    </Code>{' '}
                    — nested field
                  </Text>
                  <Text fontSize="xs" color="newGray.500">
                    •{' '}
                    <Code fontSize="xs" colorPalette="gray">
                      items[2].attachment
                    </Code>{' '}
                    — deep path
                  </Text>
                </VStack>
              </VStack>
            </VStack>
          </HoverCard.Content>
        </HoverCard.Positioner>
      </Portal>
    </HoverCard.Root>
  )
}
