import { Image, HoverCard, Portal } from '@chakra-ui/react'
import { FC } from 'react'
import { FileIcon } from 'src/widgets/TreeDataCard/ui/editors/plugins/FilePluginActions/file/FileIcon.tsx'

interface FileHoverCardProps {
  dataTestId: string
  url: string
  availablePreview: boolean
  width: number
  height: number
}

export const FileHoverCard: FC<FileHoverCardProps> = ({ url, dataTestId, availablePreview, width, height }) => {
  if (availablePreview) {
    return (
      <HoverCard.Root lazyMount unmountOnExit openDelay={350} closeDelay={100} positioning={{ gutter: 16 }}>
        <HoverCard.Trigger>
          <FileIcon dataTestId={dataTestId} url={url} />
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

  return <FileIcon dataTestId={dataTestId} url={url} />
}
