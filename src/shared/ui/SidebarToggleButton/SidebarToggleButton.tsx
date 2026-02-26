import { Box } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { PiCaretDoubleLeftLight, PiCaretDoubleRightLight } from 'react-icons/pi'
import { container } from 'src/shared/lib'
import { SidebarStateViewModel } from 'src/shared/model'
import { Tooltip } from 'src/shared/ui/Tooltip/tooltip.tsx'

export const SidebarToggleButton: FC = observer(() => {
  const sidebarState = container.get(SidebarStateViewModel)

  const isOverlay = sidebarState.isCollapsed && sidebarState.isHoverExpanded
  const label = isOverlay ? 'Expand sidebar' : 'Collapse sidebar'
  const Icon = isOverlay ? PiCaretDoubleRightLight : PiCaretDoubleLeftLight

  return (
    <Tooltip content={label}>
      <Box
        as="button"
        fontSize="20px"
        color="newGray.400"
        cursor="pointer"
        _hover={{ color: 'newGray.600' }}
        display="flex"
        alignItems="center"
        flexShrink={0}
        onClick={sidebarState.toggle}
        opacity={isOverlay ? 1 : 0}
        _groupHover={{ opacity: 1 }}
        transition="opacity 0.15s ease"
        aria-label={label}
      >
        <Icon />
      </Box>
    </Tooltip>
  )
})
