import { Badge, Box, Center, Flex, Image, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { PiCheckCircleLight, PiClockLight } from 'react-icons/pi'
import { getFileIcon } from 'src/pages/AssetsPage/lib/getFileIcon'
import { AssetItemViewModel } from 'src/pages/AssetsPage/model/AssetItemViewModel'

interface AssetCardProps {
  item: AssetItemViewModel
  onClick: () => void
}

export const AssetCard: FC<AssetCardProps> = observer(({ item, onClick }) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      cursor="pointer"
      transition="all 0.2s"
      _hover={{ borderColor: 'blue.500', shadow: 'md' }}
      onClick={onClick}
      bg="bg.panel"
    >
      <Box height="120px" bg="bg.subtle" position="relative">
        {item.thumbnailUrl ? (
          <Image src={item.thumbnailUrl} alt={item.fileName} objectFit="cover" width="100%" height="100%" />
        ) : (
          <Center height="100%" color="fg.muted">
            {getFileIcon(item.mimeType)}
          </Center>
        )}
        <Box position="absolute" top={2} right={2}>
          {item.isUploaded ? (
            <Badge colorPalette="green" size="sm">
              <PiCheckCircleLight />
            </Badge>
          ) : (
            <Badge colorPalette="yellow" size="sm">
              <PiClockLight />
            </Badge>
          )}
        </Box>
      </Box>

      <VStack align="stretch" padding={3} gap={1}>
        <Text fontWeight="medium" fontSize="sm" lineClamp={1} minHeight="1.25em" title={item.fileName || undefined}>
          {item.fileName || '\u00A0'}
        </Text>

        <Flex justify="space-between" align="center" gap={2}>
          <Badge size="sm" colorPalette="gray" variant="subtle" flexShrink={1} minWidth={0}>
            <Text lineClamp={1}>{item.tableId}</Text>
          </Badge>
          <Text fontSize="xs" color="fg.muted" flexShrink={0} whiteSpace="nowrap">
            {item.formattedSize}
          </Text>
        </Flex>
      </VStack>
    </Box>
  )
})
