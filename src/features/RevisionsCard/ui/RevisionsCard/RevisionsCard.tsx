import { Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { PiArrowDownThin, PiArrowRightThin } from 'react-icons/pi'
import { IconType, PAGE_ICONS } from 'src/features/RevisionsCard/config/icons.ts'
import { useRevisionsCardModel } from 'src/features/RevisionsCard/hooks/useRevisionsCardModel.ts'

import {
  BranchRevisionsCardItem,
  BranchRevisionsCardItemPage,
} from 'src/features/RevisionsCard/ui/RevisionsCardItem/BranchRevisionsCardItem'

export const RevisionsCard: React.FC = observer(() => {
  const store = useRevisionsCardModel()

  return store.items.length ? (
    <Flex alignItems="flex-start" justifyContent="space-between" paddingBottom="1rem">
      <Flex flexDirection="column" flex={1} gap="1rem">
        <Flex data-testid="revision-endpoint-widget">
          {store.items.map((item, index) => (
            <React.Fragment key={item.id}>
              <Flex alignItems="center" flexDirection="column">
                {item.icon === IconType.PreviousPage && (
                  <BranchRevisionsCardItemPage data={item} onSelect={store.previousPage} />
                )}
                {item.icon === IconType.NextPage && (
                  <BranchRevisionsCardItemPage data={item} onSelect={store.nextPage} />
                )}
                {!PAGE_ICONS.includes(item.icon) && <BranchRevisionsCardItem data={item} />}

                {item.children.length ? <PiArrowDownThin opacity="0.15" /> : null}
                {item.children.map((child) => (
                  <BranchRevisionsCardItem key={child.id} data={child} />
                ))}
              </Flex>
              {index !== store.items.length - 1 && (
                <Flex alignItems="center" height="40px">
                  <PiArrowRightThin opacity="0.15" />
                </Flex>
              )}
            </React.Fragment>
          ))}
        </Flex>
      </Flex>
    </Flex>
  ) : null
})
