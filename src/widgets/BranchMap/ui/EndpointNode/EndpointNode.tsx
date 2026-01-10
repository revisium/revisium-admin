import { Box, Button, HoverCard, Icon, Portal, Text, VStack } from '@chakra-ui/react'
import { Handle, Position } from '@xyflow/react'
import { observer } from 'mobx-react-lite'
import { FC, memo } from 'react'
import { PiPlugLight, PiGraphLight } from 'react-icons/pi'
import { useBranchMapContext } from '../../lib/BranchMapContext.ts'
import { EndpointNodeViewModel } from '../../model/view-model/EndpointNodeViewModel.ts'

interface EndpointNodeProps {
  data: {
    model: EndpointNodeViewModel
    onMouseEnter: (nodeId: string) => void
    onMouseLeave: () => void
    onClick: (nodeId: string) => void
    onNavigateToEndpoints: () => void
  }
}

const EndpointNodeInner: FC<EndpointNodeProps> = observer(({ data }) => {
  const { model, onMouseEnter, onMouseLeave, onClick, onNavigateToEndpoints } = data
  const { containerRef } = useBranchMapContext()

  const isHighlighted = model.isHighlighted
  const isDimmed = model.isDimmed

  const hasGraphQL = model.hasGraphQL
  const hasREST = model.hasREST
  const hasBoth = hasGraphQL && hasREST

  const getBgColor = (): string => {
    if (!isHighlighted) {
      return 'white'
    }
    if (hasBoth) {
      return 'purple.50'
    }
    return hasGraphQL ? 'pink.50' : 'teal.50'
  }

  const getBorderColor = (): string => {
    if (isDimmed) {
      return 'gray.200'
    }
    if (isHighlighted) {
      if (hasBoth) {
        return 'purple.400'
      }
      return hasGraphQL ? 'pink.400' : 'teal.400'
    }
    return 'gray.300'
  }

  const getTextColor = (): string => {
    if (hasBoth) {
      return 'purple.600'
    }
    return hasGraphQL ? 'pink.600' : 'teal.600'
  }

  const getIconColor = (): string => {
    if (hasBoth) {
      return 'purple.500'
    }
    return hasGraphQL ? 'pink.500' : 'teal.500'
  }

  const getHandleColor = (): string => {
    return hasGraphQL ? '#D53F8C' : '#38A169'
  }

  return (
    <Box display="flex" justifyContent="center" width="80px">
      <HoverCard.Root openDelay={300} closeDelay={100}>
        <HoverCard.Trigger asChild>
          <Box
            px={2}
            py={1}
            bg={getBgColor()}
            border="1px solid"
            borderColor={getBorderColor()}
            borderRadius="full"
            cursor="pointer"
            opacity={isDimmed ? 0.5 : 1}
            transition="all 0.15s"
            onMouseEnter={() => onMouseEnter(model.id)}
            onMouseLeave={onMouseLeave}
            onClick={() => onClick(model.id)}
            _hover={{ borderColor: getBorderColor(), boxShadow: 'sm' }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              {hasGraphQL && <Icon as={PiGraphLight} color={getIconColor()} boxSize={3} />}
              {hasREST && <Icon as={PiPlugLight} color={getIconColor()} boxSize={3} />}
              <Text fontSize="10px" fontWeight="500" color={getTextColor()}>
                {model.label}
              </Text>
            </Box>

            <Handle id="bottom" type="source" position={Position.Bottom} style={{ background: getHandleColor() }} />
          </Box>
        </HoverCard.Trigger>

        <Portal container={containerRef}>
          <HoverCard.Positioner>
            <HoverCard.Content maxWidth="280px" p={3}>
              <HoverCard.Arrow>
                <HoverCard.ArrowTip />
              </HoverCard.Arrow>
              <VStack align="start" gap={2}>
                {model.endpoints.map((endpoint) => (
                  <Box key={endpoint.id} width="100%">
                    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" mb={1}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Icon
                          as={endpoint.type === 'GRAPHQL' ? PiGraphLight : PiPlugLight}
                          color={endpoint.type === 'GRAPHQL' ? 'pink.500' : 'teal.500'}
                          boxSize={3}
                        />
                        <Text
                          fontSize="xs"
                          fontWeight="500"
                          color={endpoint.type === 'GRAPHQL' ? 'pink.600' : 'teal.600'}
                        >
                          {endpoint.type === 'GRAPHQL' ? 'GraphQL' : 'REST'}
                        </Text>
                      </Box>
                      <Button
                        size="xs"
                        variant="ghost"
                        colorPalette={endpoint.type === 'GRAPHQL' ? 'pink' : 'green'}
                        onClick={onNavigateToEndpoints}
                      >
                        Open
                      </Button>
                    </Box>
                    <Text fontSize="10px" color="gray.500">
                      ID: {endpoint.id}
                    </Text>
                    <Text fontSize="10px" color="gray.500">
                      Created: {new Date(endpoint.createdAt).toLocaleString()}
                    </Text>
                  </Box>
                ))}
              </VStack>
            </HoverCard.Content>
          </HoverCard.Positioner>
        </Portal>
      </HoverCard.Root>
    </Box>
  )
})

export const EndpointNode = memo(EndpointNodeInner)
