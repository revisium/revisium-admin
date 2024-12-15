import { useCurrentDraftRevision } from 'src/shared/model/ProjectPageModel/hooks/revision/useCurrentDraftRevision.ts'
import { useCurrentHeadRevision } from 'src/shared/model/ProjectPageModel/hooks/revision/useCurrentHeadRevision.ts'
import { useCurrentSpecificRevision } from 'src/shared/model/ProjectPageModel/hooks/revision/useCurrentSpecificRevision.ts'
import { IRevisionModel } from 'src/shared/model/BackendStore'

export const useCurrentRevision = (): IRevisionModel | null => {
  const draftRevision = useCurrentDraftRevision()
  const headRevision = useCurrentHeadRevision()
  const specificRevision = useCurrentSpecificRevision()

  return draftRevision || headRevision || specificRevision
}
