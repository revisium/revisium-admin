import { Box, Text, Tooltip } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { PiFile } from 'react-icons/pi'

interface ReadonlyCellProps {
  value: string
  type: 'file' | 'object' | 'array' | 'readonly'
  fileName?: string
  onClick?: () => void
}

export const ReadonlyCell: FC<ReadonlyCellProps> = observer(({ value, type, fileName, onClick }) => {
  const getDisplayValue = () => {
    switch (type) {
      case 'file':
        return (
          <Box display="flex" alignItems="center" gap={1} color="gray.600">
            <PiFile />
            <Text truncate>{fileName || 'File'}</Text>
          </Box>
        )
      case 'object':
        return '{...}'
      case 'array':
        return '[...]'
      case 'readonly':
        return (
          <Text truncate color="gray.500">
            {value}
          </Text>
        )
      default:
        return value
    }
  }

  const getTooltipContent = () => {
    switch (type) {
      case 'file':
        return 'Click to view file details'
      case 'object':
      case 'array':
        return 'Click to edit on row page'
      case 'readonly':
        return 'This field is read-only'
      default:
        return undefined
    }
  }

  const tooltipContent = getTooltipContent()
  const isClickable = type !== 'readonly' && onClick

  const content = (
    <Box
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      cursor={isClickable ? 'pointer' : 'default'}
      onClick={isClickable ? onClick : undefined}
      color="gray.500"
      _hover={isClickable ? { color: 'gray.700', textDecoration: 'underline' } : undefined}
    >
      {getDisplayValue()}
    </Box>
  )

  if (tooltipContent) {
    return (
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{content}</Tooltip.Trigger>
        <Tooltip.Positioner>
          <Tooltip.Content>{tooltipContent}</Tooltip.Content>
        </Tooltip.Positioner>
      </Tooltip.Root>
    )
  }

  return content
})
