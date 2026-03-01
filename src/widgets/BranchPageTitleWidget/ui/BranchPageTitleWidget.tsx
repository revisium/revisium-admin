import { Breadcrumbs, BreadcrumbEditableProps, BreadcrumbSegment } from '@revisium/schema-toolkit-ui'
import { observer } from 'mobx-react-lite'
import { useNavigate, useParams } from 'react-router-dom'
import { useViewModel } from 'src/shared/lib/hooks/useViewModel.ts'
import { BranchPageTitleWidgetModel } from 'src/widgets/BranchPageTitleWidget/model/BranchPageTitleWidgetModel.ts'

interface BranchPageTitleWidgetProps {
  rowIdEditable?: BreadcrumbEditableProps
  rowIdReadonly?: string
  onLastSegmentClick?: () => void
}

export const BranchPageTitleWidget = observer(
  ({ rowIdEditable, rowIdReadonly, onLastSegmentClick }: BranchPageTitleWidgetProps) => {
    const { tableId, rowId } = useParams()
    const navigate = useNavigate()
    const model = useViewModel(BranchPageTitleWidgetModel, tableId, rowId)

    const segments: BreadcrumbSegment[] = model.breadcrumbs.map((breadcrumb) => ({
      label: breadcrumb.title,
      dataTestId: breadcrumb.dataTestId,
    }))

    if (rowIdReadonly) {
      segments.push({ label: rowIdReadonly })
    }

    const handleSegmentClick = (_segment: BreadcrumbSegment, index: number) => {
      const isLast = index === model.breadcrumbs.length - 1
      if (isLast && onLastSegmentClick) {
        onLastSegmentClick()
      } else if (index < model.breadcrumbs.length) {
        navigate(model.breadcrumbs[index].href)
      }
    }

    return (
      <Breadcrumbs
        segments={segments}
        highlightLast={false}
        onSegmentClick={handleSegmentClick}
        editable={rowIdEditable}
      />
    )
  },
)
