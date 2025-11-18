import { Dialog, Portal, Input, VStack, Text, Box, Spinner, Flex, HStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useRef } from 'react'
import { PiMagnifyingGlassLight } from 'react-icons/pi'
import { SearchModalModel } from 'src/widgets/SearchModal'
import { useHotkeys } from 'src/widgets/SearchModal/lib/useHotkeys.ts'
import { SearchResultItem } from '../SearchResultItem/SearchResultItem'

interface SearchModalProps {
  model: SearchModalModel
}

export const SearchModal: FC<SearchModalProps> = observer(({ model }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useHotkeys(model)

  return (
    <Dialog.Root
      open={model.isOpen}
      onOpenChange={(e) => (e.open ? model.openModal() : model.closeModal())}
      modal={false}
      closeOnInteractOutside={true}
      placement="top"
      motionPreset="slide-in-top"
      initialFocusEl={() => inputRef.current}
    >
      <Portal>
        <Dialog.Positioner>
          <Dialog.Content
            maxW="600px"
            mt="20vh"
            borderRadius="xl"
            boxShadow="0 20px 60px -10px rgba(0, 0, 0, 0.15)"
            border="1px solid"
            borderColor="newGray.100"
            overflow="hidden"
          >
            <Box p={4}>
              <HStack gap={3}>
                <Box color="gray.400" fontSize="20px">
                  <PiMagnifyingGlassLight />
                </Box>
                <Input
                  ref={inputRef}
                  placeholder="Search all rows across all tables..."
                  value={model.searchQuery}
                  onChange={(e) => model.setSearchQuery(e.target.value)}
                  variant="flushed"
                  fontSize="md"
                  fontWeight="400"
                  _placeholder={{ color: 'newGray.400' }}
                  autoFocus
                  flex={1}
                />
              </HStack>
            </Box>

            {model.searchQuery && (
              <Box borderTop="1px solid" borderColor="newGray.100">
                {model.isLoading && (
                  <Flex justify="center" align="center" py={8}>
                    <Spinner size="sm" color="newGray.400" />
                  </Flex>
                )}

                {model.hasResults && (
                  <VStack gap={0} align="stretch" maxH="400px" overflowY="auto" py={2}>
                    {model.results.map((result, index) => (
                      <SearchResultItem
                        key={result.rowId}
                        model={result}
                        isSelected={index === model.selectedIndex}
                        onClick={() => {
                          void model.navigateToResult(result)
                        }}
                      />
                    ))}
                  </VStack>
                )}

                {model.hasNoResults && (
                  <Flex justify="center" align="center" py={8}>
                    <Text color="newGray.400" fontSize="sm">
                      No results found for "{model.searchQuery}"
                    </Text>
                  </Flex>
                )}

                {model.hasError && (
                  <Flex justify="center" align="center" py={8}>
                    <Text color="red.500" fontSize="sm">
                      An error occurred while searching
                    </Text>
                  </Flex>
                )}
              </Box>
            )}

            {model.isInit && !model.searchQuery && (
              <Box px={4} pb={3}>
                <Text fontSize="xs" color="newGray.400">
                  Type to search across all tables and rows
                </Text>
              </Box>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
})
