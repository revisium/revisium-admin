import {
  Badge,
  Box,
  Button,
  Center,
  CloseButton,
  Drawer,
  Heading,
  HoverCard,
  HStack,
  IconButton,
  Image,
  Link,
  Portal,
  Separator,
  Text,
  VStack,
} from '@chakra-ui/react'
import { json } from '@codemirror/lang-json'
import { githubLight } from '@uiw/codemirror-theme-github'
import CodeMirror, { EditorView } from '@uiw/react-codemirror'
import { nanoid } from 'nanoid'
import { observer } from 'mobx-react-lite'
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  PiArrowSquareOutLight,
  PiCheckCircleLight,
  PiClockLight,
  PiCodeLight,
  PiCopy,
  PiDownloadLight,
  PiUploadLight,
} from 'react-icons/pi'
import { Link as RouterLink } from 'react-router-dom'
import { PatchRowOp } from 'src/__generated__/graphql-request'
import { useLinkMaker } from 'src/entities/Navigation/hooks/useLinkMaker'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext'
import { extractFileByPath, FileData } from 'src/pages/AssetsPage/lib/extractFilesFromData'
import { getFileIcon } from 'src/pages/AssetsPage/lib/getFileIcon'
import { AssetItemViewModel } from 'src/pages/AssetsPage/model/AssetItemViewModel'
import { container } from 'src/shared/lib'
import { ProjectPermissions } from 'src/shared/model/AbilityService'
import { client } from 'src/shared/model/ApiService'
import { FileService } from 'src/shared/model/FileService'
import { toaster } from 'src/shared/ui'
import { ContentEditable } from 'src/shared/ui/ContentEditable/ContentEditable'

interface AssetDetailDrawerProps {
  item: AssetItemViewModel | null
  onClose: () => void
}

const DetailRow: FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => {
  if (!value) {
    return null
  }
  return (
    <HStack justify="space-between" width="100%">
      <Text color="fg.muted" fontSize="sm">
        {label}
      </Text>
      <Box fontSize="sm" fontWeight="medium">
        {value}
      </Box>
    </HStack>
  )
}

interface JsonPreviewButtonProps {
  file: FileData
}

const JsonPreviewButton: FC<JsonPreviewButtonProps> = ({ file }) => {
  const jsonText = useMemo(() => JSON.stringify(file, null, 2), [file])

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(jsonText)
    toaster.info({
      duration: 1500,
      description: 'Copied to clipboard',
    })
  }, [jsonText])

  return (
    <HoverCard.Root size="lg" openDelay={200} closeDelay={100}>
      <HoverCard.Trigger asChild>
        <IconButton variant="ghost" size="xs" color="fg.muted" aria-label="View JSON">
          <PiCodeLight />
        </IconButton>
      </HoverCard.Trigger>
      <HoverCard.Positioner>
        <HoverCard.Content maxWidth="400px" p={2}>
          <HoverCard.Arrow>
            <HoverCard.ArrowTip />
          </HoverCard.Arrow>
          <VStack align="stretch" gap={2}>
            <HStack justify="space-between" px={1}>
              <Text fontSize="xs" color="newGray.600" fontWeight="600">
                File JSON
              </Text>
              <IconButton variant="ghost" size="xs" color="fg.muted" aria-label="Copy JSON" onClick={handleCopy}>
                <PiCopy />
              </IconButton>
            </HStack>
            <Box maxHeight="300px" overflow="auto" borderRadius="md">
              <CodeMirror
                value={jsonText}
                extensions={[EditorView.lineWrapping, json()]}
                editable={false}
                theme={githubLight}
                basicSetup={{
                  lineNumbers: false,
                  foldGutter: false,
                  highlightActiveLine: false,
                  highlightActiveLineGutter: false,
                }}
              />
            </Box>
          </VStack>
        </HoverCard.Content>
      </HoverCard.Positioner>
    </HoverCard.Root>
  )
}

interface EditableFileNameProps {
  item: AssetItemViewModel
}

const EditableFileName: FC<EditableFileNameProps> = observer(({ item }) => {
  const [internalValue, setInternalValue] = useState(item.fileName)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    setInternalValue(item.fileName)
  }, [item.fileName])

  const handleChange = useCallback((newValue: string) => {
    setInternalValue(newValue)
  }, [])

  const handleBlur = useCallback(async () => {
    setFocused(false)

    if (internalValue === item.fileName) {
      return
    }

    const context = container.get(ProjectContext)
    const path = item.fieldPath ? `${item.fieldPath}.fileName` : 'fileName'

    try {
      const result = await client.PatchRowInline({
        data: {
          revisionId: context.revisionId,
          tableId: item.tableId,
          rowId: item.rowId,
          patches: [
            {
              op: PatchRowOp.Replace,
              path,
              value: internalValue,
            },
          ],
        },
      })

      if (result.patchRow?.row) {
        const fileData = extractFileByPath(result.patchRow.row.data, item.fieldPath)
        if (fileData) {
          item.updateFileData(fileData)
        }
      } else {
        setInternalValue(item.fileName)
        toaster.error({ title: 'Failed to update file name', duration: 3000 })
      }
    } catch {
      setInternalValue(item.fileName)
      toaster.error({ title: 'Failed to update file name', duration: 3000 })
    }
  }, [internalValue, item])

  const handleFocus = useCallback(() => {
    setFocused(true)
  }, [])

  const isEmpty = !internalValue
  const showBackground = focused || isEmpty

  return (
    <Box
      borderRadius="4px"
      bgColor={showBackground ? 'newGray.100' : undefined}
      _hover={{ bgColor: 'newGray.100' }}
      px="6px"
      py="2px"
      minHeight="28px"
      minWidth={isEmpty ? '140px' : '15px'}
      fontSize="lg"
      fontWeight="semibold"
      lineHeight="1.4"
      mr={2}
    >
      <ContentEditable
        initValue={internalValue}
        placeholder="Enter file name"
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </Box>
  )
})

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

      try {
        const fileService = container.get(FileService)

        const result = await fileService.add({
          revisionId: context.revisionId,
          tableId: item.tableId,
          rowId: item.rowId,
          fileId: item.fileId,
          file,
        })

        if (result?.row) {
          const fileData = extractFileByPath(result.row.data, item.fieldPath)
          if (fileData) {
            item.updateFileData(fileData)
          }
        }

        toaster.update(toastId, { type: 'info', title: 'Successfully uploaded!', duration: 1500 })
      } catch {
        toaster.update(toastId, { type: 'error', title: 'Upload failed', duration: 3000 })
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
    [item, context],
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
                    <JsonPreviewButton file={item.file} />
                  </HStack>

                  <HStack justify="space-between" width="100%">
                    <Text color="fg.muted" fontSize="sm">
                      Status
                    </Text>
                    {item.isUploaded ? (
                      <Badge colorPalette="green">
                        <PiCheckCircleLight />
                        Uploaded
                      </Badge>
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
                <HStack gap={3} width="100%">
                  <Button variant="outline" flex={1} onClick={handleOpen}>
                    <PiArrowSquareOutLight />
                    Open
                  </Button>
                  <Button asChild variant="solid" flex={1}>
                    <a href={item.url} download={item.fileName || 'file'} target="_blank" rel="noopener noreferrer">
                      <PiDownloadLight />
                      Download
                    </a>
                  </Button>
                </HStack>
              </Drawer.Footer>
            )}
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  )
})
