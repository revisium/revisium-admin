import { ScrollArea } from '@chakra-ui/react'
import { FC } from 'react'
import { Item } from 'src/features/SearchForeignKey/ui/SearchForeignKey/Item.tsx'

interface ListProps {
  ids: string[]
  onSelect: (id: string) => void
}

export const List: FC<ListProps> = ({ ids, onSelect }) => {
  return (
    <ScrollArea.Root height="100%" variant="hover" data-testid="fk-list">
      <ScrollArea.Viewport>
        <ScrollArea.Content>
          {ids.map((id) => (
            <Item key={id} id={id} onSelect={onSelect} />
          ))}
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar />
    </ScrollArea.Root>
  )
}
