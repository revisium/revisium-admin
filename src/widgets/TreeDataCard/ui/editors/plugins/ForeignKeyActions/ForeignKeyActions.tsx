import { Flex } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useCallback } from 'react'
import { PiArrowSquareUpRightThin, PiInfo } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import { useLinkMaker } from 'src/entities/Navigation/hooks/useLinkMaker.ts'
import { RowEditorMode, useRowEditorActions } from 'src/features/CreateRowCard/model/RowEditorActions.ts'
import { Tooltip } from 'src/shared/ui'
import { ForeignKeyValueNode } from 'src/widgets/TreeDataCard/model/ForeignKeyValueNode.ts'
import { IconBox } from 'src/widgets/TreeDataCard/ui/components/IconBox.tsx'

interface ForeignKeyActionsProps {
  node: ForeignKeyValueNode
  readonly?: boolean
}

export const ForeignKeyActions: FC<ForeignKeyActionsProps> = observer(({ node, readonly }) => {
  const store = node.store

  const linkMaker = useLinkMaker()
  const navigate = useNavigate()

  const { mode } = useRowEditorActions()

  const handleViewForeignKey = useCallback(async () => {
    navigate(
      linkMaker.make({
        ...linkMaker.getCurrentOptions(),
        tableId: store.foreignKey,
        rowId: store.getPlainValue(),
      }),
      { state: { isBackToRow: true } },
    )
  }, [linkMaker, navigate, store])

  const showWarningViewForeignKey = store.foreignKey && !readonly && !store.getPlainValue()
  const showViewForeignKey = store.foreignKey && mode !== RowEditorMode.Creating && store.getPlainValue()

  return (
    <Flex alignItems="center" gap="4px">
      {showViewForeignKey && (
        <IconBox data-testid={`${node.dataTestId}-view-foreign-key`} onClick={handleViewForeignKey}>
          <PiArrowSquareUpRightThin />
        </IconBox>
      )}
      {showWarningViewForeignKey && (
        <Tooltip
          openDelay={50}
          closeDelay={50}
          showArrow
          positioning={{ placement: 'bottom-start' }}
          content="This field requires a valid foreign id"
        >
          <Flex
            width="24px"
            height="24px"
            alignItems="center"
            justifyContent="center"
            color="gray.400"
            _groupHover={{
              color: 'black',
            }}
          >
            <PiInfo />
          </Flex>
        </Tooltip>
      )}
    </Flex>
  )
})
