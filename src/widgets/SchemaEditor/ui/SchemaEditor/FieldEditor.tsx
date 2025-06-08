import { PiDotsSixVerticalBold } from 'react-icons/pi'
import { Box, Flex, Icon, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useState } from 'react'
import { ArrayNodeStore } from 'src/widgets/SchemaEditor/model/ArrayNodeStore.ts'
import { SchemaNode } from 'src/widgets/SchemaEditor/model/NodeStore.ts'
import { ObjectNodeStore } from 'src/widgets/SchemaEditor/model/ObjectNodeStore.ts'
import { SchemaEditorMode, useSchemaEditor } from 'src/widgets/SchemaEditor/model/SchemaEditorActions.ts'
import { useDragAndDrop } from 'src/widgets/SchemaEditor/ui/SchemaEditor/hooks/useDragAndDrop.ts'
import { MenuTypes } from 'src/widgets/SchemaEditor/ui/SchemaEditor/MenuTypes.tsx'
import { ContentEditable } from 'src/shared/ui/ContentEditable/ContentEditable.tsx'
import { NodeMenu } from 'src/widgets/SchemaEditor/ui/SchemaEditor/NodeMenu.tsx'

interface TypeEditorProps {
  store: SchemaNode
  typeClassName?: string
  onBlur?: (node: SchemaNode) => void
  onEnter?: (node: SchemaNode) => void
  onRemove?: (node: SchemaNode) => void
  onSelect: (node: SchemaNode, schemaNode: SchemaNode) => void
  dataTestId: string
}

export const FieldEditor: React.FC<TypeEditorProps> = observer(
  ({ store, typeClassName, onBlur, onEnter, onRemove, onSelect, dataTestId }) => {
    const { root, mode } = useSchemaEditor()

    const [isFocused, setIsFocused] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

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
      (schemaNode: SchemaNode) => {
        onSelect(store, schemaNode)
      },
      [onSelect, store],
    )

    const applyTypeClassName = !isFocused && !isMenuOpen

    if (store.isDisabled) {
      return (
        <Flex gap="0.5rem" width="100%" justifyContent="flex-start" outline={0}>
          <Flex
            flex={0}
            position="relative"
            borderWidth={1}
            borderStyle="dashed"
            borderColor={'#00000000'}
            color={'gray.400'}
            whiteSpace="nowrap"
          >
            <Box userSelect="none">{store.draftId}</Box>
          </Flex>
          <Text color="gray.400" className={typeClassName}>
            {store.label}
          </Text>
        </Flex>
      )
    }

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
          {!store.isDisabled ? (
            <>
              {availableDragging && (
                <Flex
                  data-testid={`${dataTestId}-drag-button`}
                  position="absolute"
                  left={'-34px'}
                  className={applyTypeClassName ? typeClassName : undefined}
                  cursor="grab"
                  _hover={{
                    backgroundColor: 'gray.50',
                  }}
                  height="100%"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="4px"
                  marginLeft="-6px"
                >
                  <Icon size="md" color="gray.300">
                    <PiDotsSixVerticalBold />
                  </Icon>
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
              <Text
                data-testid={`${dataTestId}-select-type-button`}
                color="gray.400"
                textDecoration="underline"
                cursor="pointer"
                className={applyTypeClassName ? typeClassName : undefined}
              >
                {store.label}
              </Text>
            }
          />
        )}
        {store.draftId && (
          <NodeMenu
            open={isMenuOpen}
            setOpen={setIsMenuOpen}
            onRemove={onRemove ? handleRemove : undefined}
            onSettings={store.toggleSettings}
            dataTestId={`${dataTestId}-setting-button`}
            className={applyTypeClassName ? typeClassName : undefined}
          />
        )}
      </Flex>
    )
  },
)
