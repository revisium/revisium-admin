import { Box, Icon, IconButton, VStack } from '@chakra-ui/react'
import { Tooltip } from '@chakra-ui/react/tooltip'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useState } from 'react'
import {
  PiArrowCircleDownThin,
  PiArrowCircleRightThin,
  PiCircleDashedThin,
  PiCircleThin,
  PiDatabaseThin,
  PiDotOutlineThin,
  PiDotsThree,
} from 'react-icons/pi'
import { Link } from 'react-router-dom'
import { IconType, PAGE_ICONS } from 'src/features/RevisionsCard/config/icons.ts'
import { IRevisionCardItem } from 'src/features/RevisionsCard/config/types.ts'

const getIcon = (icon: IconType): React.ReactElement => {
  switch (icon) {
    case IconType.Child:
      return <PiArrowCircleDownThin size="24" />
    case IconType.Draft:
      return <PiCircleDashedThin size="24" />
    case IconType.Start:
      return <PiCircleThin size="24" />
    case IconType.Head:
      return <PiDatabaseThin size="24" />
    case IconType.Revision:
      return <PiCircleThin size="24" />
    case IconType.Parent:
      return <PiArrowCircleRightThin size="24" />
    case IconType.PreviousPage:
      return <PiDotsThree size="24" />
    case IconType.NextPage:
      return <PiDotsThree size="24" />
  }
}

interface BranchRevisionsCardItemBaseProps {
  data: IRevisionCardItem
  onClick?: () => Promise<void>
}

export const BranchRevisionsCardItemBase: React.FC<BranchRevisionsCardItemBaseProps> = observer(({ data, onClick }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = useCallback(async () => {
    if (PAGE_ICONS.includes(data.icon)) {
      setIsLoading(true)
      await onClick?.()
      setIsLoading(false)
    } else {
      onClick?.()
    }
  }, [data.icon, onClick])

  return (
    <Tooltip.Root openDelay={750}>
      <Tooltip.Trigger asChild>
        <Box position="relative">
          <IconButton
            data-testid={data.dataTestId}
            loading={isLoading}
            onClick={handleClick}
            _disabled={isLoading ? { opacity: 0.2 } : { opacity: 1 }}
            _hover={data.disabled ? { opacity: 1.0 } : { opacity: 0.4 }}
            aria-label=""
            disabled={data.disabled}
            opacity={PAGE_ICONS.includes(data.icon) ? 0.7 : 0.2}
            variant="ghost"
          >
            <Icon size="lg">{getIcon(data.icon)}</Icon>
          </IconButton>
          {data.isThereEndpoint && (
            <Box position="absolute" right="0px" top="0px" opacity="0.4">
              <PiDotOutlineThin />
            </Box>
          )}
        </Box>
      </Tooltip.Trigger>
      <Tooltip.Positioner>
        <Tooltip.Content textAlign="center">
          <VStack>
            {data.tooltip.map((tooltip, index) => (
              <span key={index}>{tooltip}</span>
            ))}
          </VStack>
        </Tooltip.Content>
      </Tooltip.Positioner>
    </Tooltip.Root>
  )
})

export const BranchRevisionsCardItem: React.FC<BranchRevisionsCardItemBaseProps> = observer(({ data }) => {
  return (
    <Link to={data.link}>
      <BranchRevisionsCardItemBase data={data} />
    </Link>
  )
})

interface BranchRevisionsCardItemPageProps extends BranchRevisionsCardItemBaseProps {
  onSelect: (revisionId: string) => void
}

export const BranchRevisionsCardItemPage: React.FC<BranchRevisionsCardItemPageProps> = ({ data, onSelect }) => {
  const handleClick = useCallback(async () => {
    await onSelect(data.id)
  }, [data.id, onSelect])

  return <BranchRevisionsCardItemBase data={data} onClick={handleClick} />
}
