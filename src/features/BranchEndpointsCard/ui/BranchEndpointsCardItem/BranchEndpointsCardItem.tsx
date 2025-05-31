import { Box, Button, Flex, Link, Text } from '@chakra-ui/react'
import { Switch } from '@chakra-ui/react/switch'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { PiShareFatThin } from 'react-icons/pi'
import { SiApollographql, SiSwagger } from 'react-icons/si'
import { EndpointType } from 'src/__generated__/globalTypes.ts'
import { getLabelByEndpointType } from 'src/features/BranchEndpointsCard/config/consts.ts'
import { useBranchEndpointsCardItemModel } from 'src/features/BranchEndpointsCard/hooks/useBranchEndpointsCardItemModel.ts'

const labelMapper = {
  [EndpointType.GRAPHQL]: <SiApollographql size={20} />,
  [EndpointType.REST_API]: <SiSwagger size={20} />,
}

interface BranchEndpointsCardItemProps {
  type: EndpointType
}

export const BranchEndpointsCardItem: React.FC<BranchEndpointsCardItemProps> = observer(({ type }) => {
  const store = useBranchEndpointsCardItemModel(type)

  return (
    <Flex alignItems="center" gap="0.5rem" minWidth="90px" height="25px">
      <Box color={store.href ? 'gray.400' : 'gray.300'}>{labelMapper[type]}</Box>
      <Text width="140px" color="gray.400">
        {getLabelByEndpointType(type)}
      </Text>
      <Flex width="120px" gap="0.5rem" alignItems="center">
        <Switch.Root
          data-testid={`endpoint-switch-${type}`}
          colorPalette="gray"
          checked={Boolean(store.href)}
          onCheckedChange={store.switch}
        >
          <Switch.HiddenInput />
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch.Root>
        {store.href && (
          <Link href={store.href} target="_blank" rel="noopener noreferrer">
            <Button
              data-testid={`endpoint-button-${type}`}
              size="sm"
              aria-label="removeRow"
              color="gray.500"
              disabled={!store.href}
              variant="ghost"
              padding={0}
              minWidth="20px"
              minHeight="20px"
              height="20px"
              paddingBottom="3px"
            >
              <PiShareFatThin size="20px" />
            </Button>
          </Link>
        )}
      </Flex>
    </Flex>
  )
})
