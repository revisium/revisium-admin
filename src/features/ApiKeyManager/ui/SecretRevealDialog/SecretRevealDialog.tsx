import { Box, Button, Flex, Input, Portal, Text, VStack } from '@chakra-ui/react'
import {
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from '@chakra-ui/react/dialog'
import { observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import { PiCopy, PiWarningLight } from 'react-icons/pi'
import { toaster } from 'src/shared/ui'

interface SecretRevealDialogProps {
  isOpen: boolean
  secret: string | null
  keyName: string | null
  onClose: () => void
}

export const SecretRevealDialog: FC<SecretRevealDialogProps> = observer(({ isOpen, secret, keyName, onClose }) => {
  const handleCopy = useCallback(async () => {
    if (secret) {
      await navigator.clipboard.writeText(secret)
      toaster.info({ description: 'Copied to clipboard' })
    }
  }, [secret])

  return (
    <DialogRoot open={isOpen} onOpenChange={({ open }) => !open && onClose()} size="md" closeOnInteractOutside={false}>
      <Portal>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Your API Key</DialogTitle>
            </DialogHeader>

            <DialogBody>
              <VStack align="stretch" gap="1rem">
                {keyName && (
                  <Text fontSize="sm" color="gray.600">
                    Key <strong>{keyName}</strong> has been created successfully.
                  </Text>
                )}

                <Box>
                  <Flex gap={2}>
                    <Input value={secret ?? ''} readOnly fontFamily="mono" fontSize="sm" bg="gray.50" />
                    <Button variant="outline" onClick={handleCopy} flexShrink={0}>
                      <PiCopy />
                      Copy
                    </Button>
                  </Flex>
                </Box>

                <Flex
                  align="center"
                  gap={2}
                  p={3}
                  bg="yellow.50"
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="yellow.200"
                >
                  <PiWarningLight color="var(--chakra-colors-yellow-600)" />
                  <Text fontSize="sm" color="yellow.800">
                    Make sure to copy your API key now. You won&apos;t be able to see it again.
                  </Text>
                </Flex>
              </VStack>
            </DialogBody>

            <DialogFooter>
              <Button onClick={onClose}>I&apos;ve copied the key</Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </Portal>
    </DialogRoot>
  )
})
