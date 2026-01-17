import { Box, Flex, Text, Portal } from '@chakra-ui/react'
import { githubLight } from '@uiw/codemirror-theme-github'
import CodeMirror, { EditorView, ReactCodeMirrorRef } from '@uiw/react-codemirror'
import { observer } from 'mobx-react-lite'
import React, { FC, useCallback, useRef, useEffect, useMemo, useState } from 'react'
import { PiFunction, PiHash, PiCode, PiKeyReturn, PiCircle } from 'react-icons/pi'
import type { FormulaCompletionItem, CompletionCategory } from 'src/widgets/SchemaEditor/lib/formula'
import { FormulaEditorViewModel } from './FormulaEditorViewModel'

interface FormulaEditorProps {
  model: FormulaEditorViewModel
  dataTestId?: string
}

const CATEGORY_ICONS: Record<CompletionCategory, React.ElementType> = {
  field: PiHash,
  function: PiFunction,
  operator: PiCode,
  keyword: PiKeyReturn,
  context: PiCircle,
}

const CATEGORY_COLORS: Record<CompletionCategory, string> = {
  field: 'blue.500',
  function: 'purple.500',
  operator: 'orange.500',
  keyword: 'green.500',
  context: 'teal.500',
}

export const FormulaEditor: FC<FormulaEditorProps> = observer(({ model, dataTestId }) => {
  const editorRef = useRef<ReactCodeMirrorRef>(null)
  const completionListRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleChange = useCallback(
    (value: string) => {
      model.setValue(value)
      const view = editorRef.current?.view
      if (view) {
        model.setCursorPosition(view.state.selection.main.head)
      }
    },
    [model],
  )

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      model.hideCompletions()
      model.validate()
    }, 150)
  }, [model])

  const handleFocus = useCallback(() => {
    model.showCompletionsPanel()
  }, [model])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!model.showCompletions) {
        return
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        model.selectNextCompletion()
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        model.selectPreviousCompletion()
      } else if (event.key === 'Enter' || event.key === 'Tab') {
        const selected = model.getSelectedCompletion()
        if (selected) {
          event.preventDefault()
          const { newValue, newCursorPosition } = model.applyCompletion(selected)
          const view = editorRef.current?.view
          if (view) {
            view.dispatch({
              changes: { from: 0, to: view.state.doc.length, insert: newValue },
              selection: { anchor: newCursorPosition },
            })
          }
        }
      } else if (event.key === 'Escape') {
        model.hideCompletions()
      }
    },
    [model],
  )

  const handleCompletionClick = useCallback(
    (item: FormulaCompletionItem) => {
      const { newValue, newCursorPosition } = model.applyCompletion(item)
      const view = editorRef.current?.view
      if (view) {
        view.dispatch({
          changes: { from: 0, to: view.state.doc.length, insert: newValue },
          selection: { anchor: newCursorPosition },
        })
        view.focus()
      }
    },
    [model],
  )

  useEffect(() => {
    if (completionListRef.current && model.showCompletions) {
      const selectedElement = completionListRef.current.querySelector('[data-selected="true"]')
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [model.selectedCompletionIndex, model.showCompletions])

  const extensions = useMemo(
    () => [
      EditorView.lineWrapping,
      EditorView.updateListener.of((update) => {
        if (update.selectionSet) {
          model.setCursorPosition(update.state.selection.main.head)
        }
      }),
    ],
    [model],
  )

  return (
    <Box ref={containerRef} position="relative" width="100%">
      <Box onKeyDown={handleKeyDown}>
        <CodeMirror
          ref={editorRef}
          value={model.value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          extensions={extensions}
          theme={githubLight}
          basicSetup={{
            lineNumbers: false,
            foldGutter: false,
            highlightActiveLine: false,
            autocompletion: false,
          }}
          style={{
            fontSize: '13px',
            border: '1px solid',
            borderColor: model.validationError ? '#E53E3E' : '#E2E8F0',
            borderRadius: '4px',
          }}
          data-testid={dataTestId}
        />
      </Box>

      {model.validationError && (
        <Text color="red.500" fontSize="xs" mt="1">
          {model.validationError}
        </Text>
      )}

      {model.showCompletions && (
        <Portal>
          <CompletionList
            containerRef={containerRef}
            listRef={completionListRef}
            items={model.completionItems}
            selectedIndex={model.selectedCompletionIndex}
            onItemClick={handleCompletionClick}
          />
        </Portal>
      )}
    </Box>
  )
})

interface CompletionListProps {
  containerRef: React.RefObject<HTMLDivElement>
  listRef: React.RefObject<HTMLDivElement>
  items: FormulaCompletionItem[]
  selectedIndex: number
  onItemClick: (item: FormulaCompletionItem) => void
}

const CompletionList: FC<CompletionListProps> = observer(
  ({ containerRef, listRef, items, selectedIndex, onItemClick }) => {
    const [position, setPosition] = useState({ top: 0, left: 0 })

    useEffect(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setPosition({
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX,
        })
      }
    }, [containerRef])

    if (items.length === 0) {
      return null
    }

    return (
      <Box
        ref={listRef}
        position="absolute"
        top={`${position.top}px`}
        left={`${position.left}px`}
        zIndex="popover"
        bg="white"
        borderWidth="1px"
        borderColor="gray.200"
        borderRadius="md"
        boxShadow="lg"
        maxHeight="200px"
        overflowY="auto"
        minWidth="280px"
        maxWidth="400px"
      >
        {items.slice(0, 20).map((item, index) => (
          <CompletionItem
            key={`${item.label}-${item.category}`}
            item={item}
            isSelected={index === selectedIndex}
            onClick={() => onItemClick(item)}
          />
        ))}
      </Box>
    )
  },
)

interface CompletionItemProps {
  item: FormulaCompletionItem
  isSelected: boolean
  onClick: () => void
}

const CompletionItem: FC<CompletionItemProps> = ({ item, isSelected, onClick }) => {
  const Icon = CATEGORY_ICONS[item.category]
  const iconColor = CATEGORY_COLORS[item.category]

  return (
    <Flex
      data-selected={isSelected}
      px="3"
      py="2"
      cursor="pointer"
      bg={isSelected ? 'blue.50' : 'transparent'}
      _hover={{ bg: 'gray.50' }}
      onClick={onClick}
      alignItems="flex-start"
      gap="2"
    >
      <Box color={iconColor} mt="1">
        <Icon size={14} />
      </Box>
      <Flex direction="column" flex="1" overflow="hidden">
        <Flex alignItems="center" gap="2">
          <Text fontWeight="medium" fontSize="sm" fontFamily="mono">
            {item.label}
          </Text>
          {item.returnType && (
            <Text color="gray.400" fontSize="xs">
              → {item.returnType}
            </Text>
          )}
        </Flex>
        {item.description && (
          <Text color="gray.500" fontSize="xs" lineClamp={1}>
            {item.description}
          </Text>
        )}
        {item.signature && (
          <Text color="gray.400" fontSize="xs" fontFamily="mono">
            {item.signature}
          </Text>
        )}
      </Flex>
    </Flex>
  )
}
