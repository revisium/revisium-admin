import {
  Flex,
  IconButton,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { Popover } from '@chakra-ui/react/popover'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { PiPlugsConnectedThin, PiPlugsThin } from 'react-icons/pi'
import { EndpointType } from 'src/__generated__/globalTypes.ts'
import { useBranchEndpointsCardModel } from 'src/features/BranchEndpointsCard/hooks/useBranchEndpointsCardModel.ts'

import { BranchEndpointsCardItem } from 'src/features/BranchEndpointsCard/ui/BranchEndpointsCardItem/BranchEndpointsCardItem.tsx'

import styles from './BranchEndpointsCard.module.scss'

export const BranchEndpointsCard: React.FC = observer(() => {
  const { onOpen, onClose, open } = useDisclosure()
  const store = useBranchEndpointsCardModel()

  return (
    <Popover.Root open={open} onOpenChange={({ open }) => open ? onOpen() : onClose()}>
      <Popover.Trigger asChild>
        <IconButton
          data-testid="revision-endpoint-button"
          className={!open ? styles.Action : undefined}
          aria-label=""
          opacity={0.5}
          _hover={{ opacity: 1.0 }}
          variant="ghost"
        >
          {store.isThereEndpoint ? <PiPlugsConnectedThin size="24" /> : <PiPlugsThin size="24" />}
        </IconButton>
      </Popover.Trigger>
      <Popover.Positioner>
          <Popover.Content maxWidth="240px">
            <Popover.Arrow />
            <Popover.Body>
              <Flex flexDirection="column" gap="1rem">
                <BranchEndpointsCardItem type={EndpointType.GRAPHQL} />
                <BranchEndpointsCardItem type={EndpointType.REST_API} />
              </Flex>
            </Popover.Body>
            <Popover.Footer justifyContent="center">
              <Text color="gray.400" opacity="0.7" fontSize="xs" as="samp">
                {store.branchTitle}
              </Text>
            </Popover.Footer>
          </Popover.Content>
        </Popover.Positioner>
    </Popover.Root>
  )
})
