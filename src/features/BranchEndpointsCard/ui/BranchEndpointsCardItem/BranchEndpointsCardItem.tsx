import { Box, Button, Flex, Link, Switch, Text } from '@chakra-ui/react'
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
        <Switch
          data-testid={`endpoint-switch-${type}`}
          colorScheme="gray"
          isChecked={Boolean(store.href)}
          onChange={store.switch}
        />
        {store.href && (
          <Link isExternal href={store.href}>
            <Button
              data-testid={`endpoint-button-${type}`}
              size="sm"
              aria-label="removeRow"
              color="gray.500"
              isDisabled={!store.href}
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
