import { Box, Flex, Text } from '@chakra-ui/react'
import React, { DependencyList, KeyboardEventHandler, useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { useUpdateEffect } from 'react-use'

interface ContentEditableBoxProps {
  initValue: string
  placeholder?: string
  autoFocus?: boolean
  onBlur?: () => void
  onFocus?: () => void
  onChange?: (value: string) => void
  onEscape?: () => void
  onEnter?: () => void
  focusIfDependencyList?: DependencyList
  restrict?: RegExp
  prefix?: string
  postfix?: string
  dataTestId?: string
  allowNewLines?: boolean
}

const allowed = ['Backspace', 'Escape', 'Enter', 'ArrowRight', 'ArrowLeft', 'Delete']

export const ContentEditable: React.FC<ContentEditableBoxProps> = ({
  initValue,
  placeholder,
  autoFocus,
  onBlur,
  onChange,
  onEscape,
  onEnter,
  onFocus,
  focusIfDependencyList,
  restrict,
  prefix,
  postfix,
  dataTestId,
}) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const cursorPosition = useRef<number | null>(null)

  useEffect(() => {
    if (autoFocus) {
      ref.current?.focus()
    }
  }, [autoFocus])

  useLayoutEffect(() => {
    const selection = window.getSelection()
    if (selection && cursorPosition.current !== null && ref.current) {
      const maxPosition = (ref.current.textContent || '').length
      const position = Math.min(maxPosition, cursorPosition.current)

      const range = document.createRange()
      const sel = window.getSelection()
      const node = ref.current.childNodes.length ? ref.current.childNodes[0] : ref.current
      range.setStart(node, position)
      range.collapse(true)

      if (sel) {
        sel.removeAllRanges()
        sel.addRange(range)
      }
    }
  })

  useUpdateEffect(() => {
    if (focusIfDependencyList) {
      ref.current?.focus()
      const selection = window.getSelection()

      if (ref.current && selection) {
        const range = document.createRange()
        range.selectNodeContents(ref.current)
        range.collapse(false)
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }
  }, [...(focusIfDependencyList ? focusIfDependencyList : [])])

  const handleChange: React.FormEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        cursorPosition.current = selection.getRangeAt(0).startOffset
      }

      onChange?.(event.currentTarget.innerText)
    },
    [onChange],
  )

  const handleBlur: React.FormEventHandler<HTMLDivElement> = useCallback(() => {
    onBlur?.()
    cursorPosition.current = null
  }, [onBlur])

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        event.preventDefault()

        if (initValue) {
          ref.current?.blur()
          onEnter?.()
        }
      }
      if (event.key === 'Escape') {
        event.preventDefault()
        if (initValue) {
          ref.current?.blur()
        }
        onEscape?.()
      }

      if (restrict && !allowed.includes(event.key) && !restrict.test(event.key)) {
        event.preventDefault()
      }
    },
    [initValue, onEnter, onEscape, restrict],
  )

  const handleParentClick = useCallback(() => {
    ref.current?.focus()
  }, [])

  const showPlaceholder = !initValue && placeholder

  return (
    <Flex minWidth={0} width={showPlaceholder ? '100%' : undefined} position="relative" onClick={handleParentClick}>
      {!showPlaceholder && prefix}
      <Box
        data-testid={dataTestId}
        autoFocus
        ref={ref}
        contentEditable
        spellCheck={'false'}
        dangerouslySetInnerHTML={{ __html: initValue }}
        outline={0}
        width="100%"
        onBlur={handleBlur}
        onFocus={onFocus}
        onChange={handleChange}
        onInput={handleChange}
        onKeyDown={handleKeyDown}
      ></Box>
      {!showPlaceholder && postfix}
      {showPlaceholder && (
        <Text
          cursor="text"
          userSelect="none"
          pointerEvents="none"
          whiteSpace="nowrap"
          color="gray.400"
          position="absolute"
        >
          {placeholder}
        </Text>
      )}
    </Flex>
  )
}
