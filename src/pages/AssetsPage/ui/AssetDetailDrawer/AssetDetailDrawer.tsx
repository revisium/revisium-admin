import {
  Badge,
  Box,
  Button,
  Center,
  CloseButton,
  Drawer,
  Heading,
  HStack,
  Image,
  Link,
  Portal,
  Separator,
  VStack,
} from '@chakra-ui/react'
import { nanoid } from 'nanoid'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useRef } from 'react'
import { PiArrowSquareOutLight, PiClockLight, PiUploadLight } from 'react-icons/pi'
import { Link as RouterLink } from 'react-router-dom'
import { useLinkMaker } from 'src/entities/Navigation/hooks/useLinkMaker'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext'
import { getFileIcon } from 'src/pages/AssetsPage/lib/getFileIcon'
import { AssetItemViewModel } from 'src/pages/AssetsPage/model/AssetItemViewModel'
import { DetailRow } from 'src/pages/AssetsPage/ui/DetailRow/DetailRow'
import { EditableFileName } from 'src/pages/AssetsPage/ui/EditableFileName/EditableFileName'
import { JsonPreviewButton } from 'src/pages/AssetsPage/ui/JsonPreviewButton/JsonPreviewButton'
import { container } from 'src/shared/lib'
import { ProjectPermissions } from 'src/shared/model/AbilityService'
import { toaster } from 'src/shared/ui'

interface AssetDetailDrawerProps {
  item: AssetItemViewModel | null
  onClose: () => void
}

export const AssetDetailDrawer: FC<AssetDetailDrawerProps> = observer(({ item, onClose }) => {
  const linkMaker = useLinkMaker()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const permissions = container.get(ProjectPermissions)
  const context = container.get(ProjectContext)

  const canEdit = permissions.canUpdateRow && context.isDraftRevision

  const handleOpen = useCallback(() => {
    if (item?.url) {
      window.open(item.url, '_blank')
    }
  }, [item?.url])

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file || !item) {
        return
      }

      const toastId = nanoid()
      toaster.loading({ id: toastId, title: 'Uploading...' })

      const success = await item.uploadFile(file)

      if (success) {
        toaster.update(toastId, { type: 'info', title: 'Successfully uploaded!', duration: 1500 })
      } else {
        toaster.update(toastId, { type: 'error', title: 'Upload failed', duration: 3000 })
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
    [item],
  )

  if (!item) {
    return null
  }

  const tableLink = linkMaker.make({
    ...linkMaker.getCurrentOptions(),
    tableId: item.tableId,
    rowId: undefined,
  })

  const rowLink = linkMaker.make({
    ...linkMaker.getCurrentOptions(),
    tableId: item.tableId,
    rowId: item.rowId,
  })

  return (
    <Drawer.Root
      open={!!item}
      onOpenChange={(e) => !e.open && onClose()}
      placement="end"
      size="md"
      initialFocusEl={() => null}
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <HStack flex={1} minWidth={0}>
                {canEdit ? (
                  <EditableFileName item={item} />
                ) : (
                  <Drawer.Title lineClamp={1}>{item.fileName || 'Untitled file'}</Drawer.Title>
                )}
              </HStack>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Header>

            <Drawer.Body>
              <input
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept={item.mimeType || '*/*'}
              />
              <VStack gap={6} align="stretch">
                <Box
                  className="group"
                  height="200px"
                  bg="bg.subtle"
                  borderRadius="md"
                  overflow="hidden"
                  position="relative"
                  cursor={canEdit ? 'pointer' : 'default'}
                  onClick={canEdit ? handleUploadClick : undefined}
                >
                  {item.thumbnailUrl ? (
                    <Image src={item.thumbnailUrl} alt={item.fileName} objectFit="contain" width="100%" height="100%" />
                  ) : (
                    <Center height="100%" color="fg.muted">
                      {getFileIcon(item.mimeType, 64)}
                    </Center>
                  )}
                  {canEdit && (
                    <Center
                      position="absolute"
                      inset={0}
                      bg="blackAlpha.600"
                      opacity={0}
                      _groupHover={{ opacity: 1 }}
                      transition="opacity 0.2s"
                    >
                      <Button variant="outline" size="sm" bg="white" _hover={{ bg: 'gray.100' }}>
                        <PiUploadLight />
                        {item.isUploaded ? 'Replace' : 'Upload'}
                      </Button>
                    </Center>
                  )}
                </Box>

                <VStack align="stretch" gap={3}>
                  <HStack justify="space-between">
                    <Heading size="sm">Details</Heading>
                    <JsonPreviewButton file={item.file} rowData={item.rowData} fieldPath={item.fieldPath} />
                  </HStack>

                  <HStack justify="space-between" width="100%">
                    <Box color="fg.muted" fontSize="sm">
                      Status
                    </Box>
                    {item.isUploaded ? (
                      <Box fontSize="sm" fontWeight="medium">
                        Uploaded
                      </Box>
                    ) : (
                      <Badge colorPalette="yellow">
                        <PiClockLight />
                        Pending upload
                      </Badge>
                    )}
                  </HStack>

                  <DetailRow label="Size" value={item.formattedSize} />
                  <DetailRow label="Type" value={item.mimeType} />
                  <DetailRow label="Dimensions" value={item.dimensions} />
                  <DetailRow label="Extension" value={item.extension || null} />
                </VStack>

                <Separator />

                <VStack align="stretch" gap={3}>
                  <Heading size="sm">Location</Heading>
                  <DetailRow
                    label="Table"
                    value={
                      <Link asChild color="fg.muted" _hover={{ textDecoration: 'underline' }}>
                        <RouterLink to={tableLink}>{item.tableId}</RouterLink>
                      </Link>
                    }
                  />
                  <DetailRow
                    label="Row"
                    value={
                      <Link asChild color="fg.muted" _hover={{ textDecoration: 'underline' }}>
                        <RouterLink to={rowLink}>{item.rowId}</RouterLink>
                      </Link>
                    }
                  />
                  <DetailRow label="Field" value={item.fieldPath || 'root'} />
                </VStack>
              </VStack>
            </Drawer.Body>

            {item.isUploaded && item.url && (
              <Drawer.Footer>
                <Button variant="outline" width="100%" onClick={handleOpen}>
                  <PiArrowSquareOutLight />
                  Open
                </Button>
              </Drawer.Footer>
            )}
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  )
})
