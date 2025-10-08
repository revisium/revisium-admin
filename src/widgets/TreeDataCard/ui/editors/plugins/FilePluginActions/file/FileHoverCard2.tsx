import { Image, HoverCard, Portal } from '@chakra-ui/react'
import { FC } from 'react'
import { FileIcon2 } from './FileIcon2'

interface FileHoverCard2Props {
  dataTestId: string
  url: string
  availablePreview: boolean
  width: number
  height: number
}

export const FileHoverCard2: FC<FileHoverCard2Props> = ({ url, dataTestId, availablePreview, width, height }) => {
  if (availablePreview) {
    return (
      <HoverCard.Root lazyMount unmountOnExit openDelay={350} closeDelay={100} positioning={{ gutter: 16 }}>
        <HoverCard.Trigger>
          <FileIcon2 dataTestId={dataTestId} url={url} />
        </HoverCard.Trigger>
        <Portal>
          <HoverCard.Positioner>
            <HoverCard.Content>
              <HoverCard.Arrow>
                <HoverCard.ArrowTip />
              </HoverCard.Arrow>
              <Image aspectRatio={width / height} width="400px" src={url} />
            </HoverCard.Content>
          </HoverCard.Positioner>
        </Portal>
      </HoverCard.Root>
    )
  }

  return <FileIcon2 dataTestId={dataTestId} url={url} />
}
