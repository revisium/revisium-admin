import { Box } from '@chakra-ui/react'
import React from 'react'

interface SidebarPanelProps {
  sidebar?: React.ReactNode
  footer?: React.ReactNode
}

export const SidebarPanel: React.FC<SidebarPanelProps> = ({ sidebar, footer }) => {
  return (
    <>
      {sidebar}
      {footer && (
        <Box alignSelf="center" mt="1rem">
          {footer}
        </Box>
      )}
    </>
  )
}
