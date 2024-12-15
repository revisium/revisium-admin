import {
  Flex,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { PiPlugsConnectedThin, PiPlugsThin } from 'react-icons/pi'
import { EndpointType } from 'src/__generated__/globalTypes.ts'
import { useBranchEndpointsCardModel } from 'src/features/BranchEndpointsCard/hooks/useBranchEndpointsCardModel.ts'

import { BranchEndpointsCardItem } from 'src/features/BranchEndpointsCard/ui/BranchEndpointsCardItem/BranchEndpointsCardItem.tsx'

import styles from './BranchEndpointsCard.module.scss'

export const BranchEndpointsCard: React.FC = observer(() => {
  const { onOpen, onClose, isOpen } = useDisclosure()
  const store = useBranchEndpointsCardModel()

  return (
    <Popover trigger="click" isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <PopoverTrigger>
        <IconButton
          data-testid="revision-endpoint-button"
          className={!isOpen ? styles.Action : undefined}
          aria-label=""
          icon={store.isThereEndpoint ? <PiPlugsConnectedThin size="24" /> : <PiPlugsThin size="24" />}
          opacity={0.5}
          _hover={{ opacity: 1.0 }}
          variant="ghost"
        />
      </PopoverTrigger>
      <PopoverContent maxWidth="240px">
        <PopoverArrow />
        <PopoverBody>
          <Flex flexDirection="column" gap="1rem">
            <BranchEndpointsCardItem type={EndpointType.GRAPHQL} />
            <BranchEndpointsCardItem type={EndpointType.REST_API} />
          </Flex>
        </PopoverBody>
        <PopoverFooter justifyContent="center">
          <Text color="gray.400" opacity="0.7" fontSize="xs" as="samp">
            {store.branchTitle}
          </Text>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  )
})
