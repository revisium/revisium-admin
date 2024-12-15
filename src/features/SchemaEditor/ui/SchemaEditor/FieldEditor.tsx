import { DragHandleIcon } from '@chakra-ui/icons'
import { Box, Flex, MenuButton, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useState } from 'react'
import { JsonSchema } from 'src/entities/Schema'
import { ArrayNodeStore } from 'src/features/SchemaEditor/model/ArrayNodeStore.ts'
import { SchemaNode } from 'src/features/SchemaEditor/model/NodeStore.ts'
import { ObjectNodeStore } from 'src/features/SchemaEditor/model/ObjectNodeStore.ts'
import { SchemaEditorMode, useSchemaEditor } from 'src/features/SchemaEditor/model/SchemaEditorActions.ts'
import { useDragAndDrop } from 'src/features/SchemaEditor/ui/SchemaEditor/hooks/useDragAndDrop.ts'
import { MenuTypes } from 'src/features/SchemaEditor/ui/SchemaEditor/MenuTypes.tsx'
import { ContentEditable } from 'src/shared/ui/ContentEditable/ContentEditable.tsx'
import { RemoveButton } from 'src/shared/ui/RemoveButton/RemoveButton.tsx'

interface TypeEditorProps {
  store: SchemaNode
  isEditable: boolean
  typeClassName?: string
  onBlur?: (node: SchemaNode) => void
  onEnter?: (node: SchemaNode) => void
  onRemove?: (node: SchemaNode) => void
  onSelect: (node: SchemaNode, schema: JsonSchema) => void
  dataTestId?: string
}

export const FieldEditor: React.FC<TypeEditorProps> = observer(
  ({ store, typeClassName, isEditable, onBlur, onEnter, onRemove, onSelect, dataTestId }) => {
    const { root, mode } = useSchemaEditor()

    const [isFocused, setIsFocused] = useState(false)

    const handleDrop = useCallback(
      (node: SchemaNode) => {
        if (store instanceof ObjectNodeStore) {
          root.addProperty(store, node, { beforeNode: store.draftProperties[0] })
        } else if (store instanceof ArrayNodeStore) {
          root.replaceItems(store, node)
        }
      },
      [root, store],
    )

    const availableDragging = Boolean(root.areThereDropTargets(store) && store.draftId)
    const { dragAndDropRef, isDrop, isDraggedOver, isDisabledDrop } = useDragAndDrop(
      store,
      availableDragging,
      handleDrop,
    )

    const handleBlur = useCallback(() => {
      setIsFocused(false)
      onBlur?.(store)
    }, [onBlur, store])

    const handleFocus = useCallback(() => {
      setIsFocused(true)
    }, [])

    const handleEnter = useCallback(() => {
      onEnter?.(store)
    }, [onEnter, store])

    const handleRemove = useCallback(() => {
      onRemove?.(store)
    }, [onRemove, store])

    const handleChange = useCallback(
      (value: string) => {
        root.setId(store, value)
      },
      [root, store],
    )

    const handleSelect = useCallback(
      (schema: JsonSchema) => {
        onSelect(store, schema)
      },
      [onSelect, store],
    )

    const applyTypeClassName = !isFocused

    return (
      <Flex gap="0.5rem" width="100%" justifyContent="flex-start" outline={0}>
        <Flex
          data-testid={isDrop && `${dataTestId}-drop`}
          flex={store.draftId ? 0 : 1}
          ref={dragAndDropRef}
          position="relative"
          borderWidth={1}
          borderStyle="dashed"
          borderColor={isDrop ? 'gray.400' : '#00000000'}
          backgroundColor={isDraggedOver ? 'gray.200' : undefined}
          color={isDisabledDrop ? 'gray.300' : undefined}
          whiteSpace="nowrap"
        >
          {isEditable ? (
            <>
              {availableDragging && (
                <Flex
                  data-testid={`${dataTestId}-drag-button`}
                  position="absolute"
                  left={'-34px'}
                  className={applyTypeClassName ? typeClassName : undefined}
                  cursor="grab"
                  _hover={{
                    backgroundColor: 'gray.100',
                  }}
                  height="100%"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="4px"
                  pl="2px"
                  pr="2px"
                >
                  <DragHandleIcon boxSize={'14px'} color="gray.300" />
                </Flex>
              )}
              <ContentEditable
                dataTestId={dataTestId}
                autoFocus={!store.draftId}
                initValue={store.draftId}
                placeholder={store.draftParent ? 'Enter the name of the field' : 'Enter the name of the table'}
                onBlur={handleBlur}
                onFocus={handleFocus}
                onChange={handleChange}
                onEnter={handleEnter}
                focusIfDependencyList={[store.type]}
              />
            </>
          ) : (
            <Box userSelect="none">{store.draftId}</Box>
          )}
          {mode === SchemaEditorMode.Updating && store.draftId && store.isDirtyItself && <Box cursor="default">*</Box>}
        </Flex>
        {store.draftId && (
          <MenuTypes
            dataTestId={dataTestId}
            currentSchema={store.getSchema({ skipObjectProperties: true })}
            onSelect={handleSelect}
            menuButton={
              <MenuButton
                data-testid={`${dataTestId}-select-type-button`}
                as={Text}
                color="gray.300"
                textDecoration="underline"
                cursor="pointer"
                className={applyTypeClassName ? typeClassName : undefined}
              >
                {store.type}
              </MenuButton>
            }
          />
        )}
        {onRemove && store.draftId && (
          <RemoveButton
            data-testid={`${dataTestId}-remove-button`}
            height="26px"
            aria-label="remove"
            color="gray.200"
            _hover={{ color: 'gray.400' }}
            className={applyTypeClassName ? typeClassName : undefined}
            onClick={handleRemove}
          />
        )}
      </Flex>
    )
  },
)