import { Box, CloseButton, IconButton, Input } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { ChangeEventHandler, FC, useCallback, useEffect, useRef, useState } from 'react'
import { LuSearch } from 'react-icons/lu'
import { Tooltip } from 'src/shared/ui'

const COLLAPSE_DELAY = 400
const COLLAPSED_WIDTH = 32
const EXPANDED_WIDTH = 280
const ANIMATION_DURATION = '0.2s'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
}

export const SearchInput: FC<SearchInputProps> = observer(({ value, onChange, onClear }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const collapseTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const hasValue = value.length > 0

  const clearCollapseTimeout = useCallback(() => {
    if (collapseTimeoutRef.current) {
      clearTimeout(collapseTimeoutRef.current)
      collapseTimeoutRef.current = null
    }
  }, [])

  const handleSearch: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      onChange(event.target.value)
    },
    [onChange],
  )

  const handleExpand = useCallback(() => {
    clearCollapseTimeout()
    setIsExpanded(true)
  }, [clearCollapseTimeout])

  const handleBlur = useCallback(() => {
    clearCollapseTimeout()
    if (!value) {
      collapseTimeoutRef.current = setTimeout(() => {
        setIsExpanded(false)
      }, COLLAPSE_DELAY)
    }
  }, [clearCollapseTimeout, value])

  const handleFocus = useCallback(() => {
    clearCollapseTimeout()
  }, [clearCollapseTimeout])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape' && !value) {
        clearCollapseTimeout()
        setIsExpanded(false)
        inputRef.current?.blur()
      }
    },
    [clearCollapseTimeout, value],
  )

  const handleClear = useCallback(() => {
    onClear()
    inputRef.current?.focus()
  }, [onClear])

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      requestAnimationFrame(() => {
        inputRef.current?.focus()
      })
    }
  }, [isExpanded])

  useEffect(() => {
    return () => clearCollapseTimeout()
  }, [clearCollapseTimeout])

  const tooltipContent = hasValue ? `Search: "${value}"` : 'Search rows'

  return (
    <Box
      position="relative"
      display="inline-flex"
      alignItems="center"
      width={isExpanded ? `${EXPANDED_WIDTH}px` : `${COLLAPSED_WIDTH}px`}
      height="32px"
      transition={`width ${ANIMATION_DURATION} ease-in-out`}
    >
      <Tooltip content={tooltipContent} positioning={{ placement: 'top' }} disabled={isExpanded}>
        <Box
          position="absolute"
          left={0}
          top="50%"
          transform="translateY(-50%)"
          opacity={isExpanded ? 0 : 1}
          pointerEvents={isExpanded ? 'none' : 'auto'}
          transition={`opacity ${ANIMATION_DURATION} ease-in-out`}
        >
          <IconButton
            aria-label="Search rows"
            size="sm"
            variant="ghost"
            colorPalette="gray"
            color="gray.300"
            onClick={handleExpand}
          >
            <LuSearch />
          </IconButton>
        </Box>
      </Tooltip>

      <Box
        position="absolute"
        left={0}
        top={0}
        display="flex"
        alignItems="center"
        width={`${EXPANDED_WIDTH}px`}
        height="32px"
        opacity={isExpanded ? 1 : 0}
        pointerEvents={isExpanded ? 'auto' : 'none'}
        transition={`opacity ${ANIMATION_DURATION} ease-in-out`}
      >
        <Box color="gray.400" pl="10px" flexShrink={0}>
          <LuSearch size={14} />
        </Box>
        <Input
          ref={inputRef}
          variant="flushed"
          value={value}
          onChange={handleSearch}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          _placeholder={{ color: 'gray.400' }}
          placeholder="Search..."
          size="sm"
          pl="8px"
          pr={hasValue ? '28px' : '8px'}
          tabIndex={isExpanded ? 0 : -1}
        />
        {hasValue && (
          <CloseButton
            position="absolute"
            right="0"
            color="gray.400"
            size="xs"
            onClick={handleClear}
            onMouseDown={(e) => e.preventDefault()}
          />
        )}
      </Box>
    </Box>
  )
})
