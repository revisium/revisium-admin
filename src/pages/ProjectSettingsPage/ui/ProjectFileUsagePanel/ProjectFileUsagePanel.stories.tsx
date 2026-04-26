import { ProjectFileUsagePanel, ProjectFileUsagePanelModel } from './ProjectFileUsagePanel.tsx'

const createModel = (overrides: Partial<ProjectFileUsagePanelModel> = {}): ProjectFileUsagePanelModel => ({
  isLoading: false,
  isRefreshing: false,
  isPreviewLoading: false,
  isApplyingRestore: false,
  validateError: null,
  restoreError: null,
  currentBytesLabel: '0 B (0 bytes)',
  expectedBytesLabel: '0 B (0 bytes)',
  driftLabel: '0 B (0 bytes)',
  driftColor: 'green.600',
  fileBlobCount: 0,
  referenceCount: 0,
  canRestore: false,
  restoreDialogOpen: false,
  preview: null,
  previewPreviousBytesLabel: '0 B (0 bytes)',
  previewNextBytesLabel: '0 B (0 bytes)',
  previewDriftLabel: '0 B (0 bytes)',
  validate: async () => undefined,
  previewRestore: async () => undefined,
  applyRestore: async () => undefined,
  closeRestoreDialog: () => undefined,
  ...overrides,
})

export default {
  title: 'Project Settings/ProjectFileUsagePanel',
  component: ProjectFileUsagePanel,
}

export const Loading = () => <ProjectFileUsagePanel model={createModel({ isLoading: true })} />

export const ZeroDrift = () => <ProjectFileUsagePanel model={createModel()} />

export const DriftPresent = () => (
  <ProjectFileUsagePanel
    model={createModel({
      currentBytesLabel: '1.0 KB (1,024 bytes)',
      expectedBytesLabel: '2.0 KB (2,048 bytes)',
      driftLabel: '1.0 KB (1,024 bytes)',
      driftColor: 'orange.600',
      fileBlobCount: 1,
      referenceCount: 2,
      canRestore: true,
    })}
  />
)

export const ErrorState = () => (
  <ProjectFileUsagePanel
    model={createModel({
      validateError: 'Network request failed',
      currentBytesLabel: '1.0 KB (1,024 bytes)',
      expectedBytesLabel: '2.0 KB (2,048 bytes)',
      driftLabel: '1.0 KB (1,024 bytes)',
      driftColor: 'red.600',
      fileBlobCount: 1,
      referenceCount: 2,
      canRestore: true,
    })}
  />
)

export const NoPermission = () => (
  <ProjectFileUsagePanel
    model={createModel({
      currentBytesLabel: '1.0 KB (1,024 bytes)',
      expectedBytesLabel: '2.0 KB (2,048 bytes)',
      driftLabel: '1.0 KB (1,024 bytes)',
      driftColor: 'orange.600',
      fileBlobCount: 1,
      referenceCount: 2,
      canRestore: false,
    })}
  />
)
