import { Box, Flex } from '@chakra-ui/react'
import { FC } from 'react'

interface GuidesProps {
  guides: boolean[]
}

export const Guides: FC<GuidesProps> = ({ guides }) => {
  return (
    <Flex position="relative" alignItems="center">
      {guides.map((showLine, index) => (
        <Box
          key={index}
          position="relative"
          width="20px"
          height="100%"
          _before={
            showLine
              ? {
                  content: '""',
                  position: 'absolute',
                  left: '8px',
                  top: 0,
                  bottom: 0,
                  width: '1px',
                  backgroundColor: 'blackAlpha.200',
                }
              : undefined
          }
        />
      ))}
    </Flex>
  )
}
