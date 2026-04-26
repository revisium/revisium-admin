import { ClientError } from 'graphql-request'
import { PermissionService, ProjectPermissions } from 'src/shared/model/AbilityService'
import { ProjectFileUsageViewModel } from './ProjectFileUsageViewModel'

jest.mock('src/shared/model/ApiService.ts', () => ({
  client: {
    adminValidateProjectFileBytes: jest.fn(),
    adminRestoreProjectFileBytes: jest.fn(),
  },
}))

jest.mock('src/shared/ui', () => ({
  toaster: {
    success: jest.fn(),
  },
}))

const { client } = jest.requireMock('src/shared/model/ApiService.ts') as {
  client: {
    adminValidateProjectFileBytes: jest.Mock
    adminRestoreProjectFileBytes: jest.Mock
  }
}

const { toaster } = jest.requireMock('src/shared/ui') as {
  toaster: {
    success: jest.Mock
  }
}

const adminValidateProjectFileBytes = client.adminValidateProjectFileBytes
const adminRestoreProjectFileBytes = client.adminRestoreProjectFileBytes
const toasterSuccess = toaster.success

function createClientError(message: string, status = 200): ClientError {
  return new ClientError(
    {
      status,
      errors: [{ message }] as never,
      data: null as never,
    },
    { query: 'mutation test { test }' },
  )
}

describe('ProjectFileUsageViewModel', () => {
  let permissionService: PermissionService
  let projectPermissions: ProjectPermissions

  beforeEach(() => {
    adminValidateProjectFileBytes.mockReset()
    adminRestoreProjectFileBytes.mockReset()
    toasterSuccess.mockReset()

    permissionService = new PermissionService()
    projectPermissions = new ProjectPermissions(permissionService)
    projectPermissions.setContextProvider(() => ({
      projectId: 'project-1',
      organizationId: 'org-1',
      isPublic: false,
      projectRoleName: 'Admin',
    }))
  })

  it('loads validate data and exposes zero-drift state', async () => {
    permissionService.addProjectPermissions('project-1', [
      { id: 'manage-file-usage', action: 'manage', subject: 'FileUsage' },
    ])

    adminValidateProjectFileBytes.mockResolvedValue({
      adminValidateProjectFileBytes: {
        projectId: 'project-1',
        currentFileBytes: '0',
        expectedFileBytes: '0',
        drift: '0',
        fileBlobCount: 0,
        referenceCount: 0,
      },
    })

    const vm = new ProjectFileUsageViewModel(projectPermissions, permissionService)
    await Promise.resolve()

    expect(adminValidateProjectFileBytes).toHaveBeenCalledWith({ data: { projectId: 'project-1' } })
    expect(vm.currentBytesLabel).toBe('0 B (0 bytes)')
    expect(vm.expectedBytesLabel).toBe('0 B (0 bytes)')
    expect(vm.driftLabel).toBe('0 B (0 bytes)')
    expect(vm.fileBlobCount).toBe(0)
    expect(vm.referenceCount).toBe(0)
    expect(vm.canRestore).toBe(false)

    vm.dispose()
  })

  it('does not auto-validate without manage permission', async () => {
    const vm = new ProjectFileUsageViewModel(projectPermissions, permissionService)
    await Promise.resolve()

    expect(adminValidateProjectFileBytes).not.toHaveBeenCalled()
    expect(vm.hasManagePermission).toBe(false)
    expect(vm.currentBytesLabel).toBe('0 B (0 bytes)')

    vm.dispose()
  })

  it('shows restore action only when drift is non-zero and manage permission exists', async () => {
    permissionService.addProjectPermissions('project-1', [
      { id: 'manage-file-usage', action: 'manage', subject: 'FileUsage' },
    ])
    adminValidateProjectFileBytes.mockResolvedValue({
      adminValidateProjectFileBytes: {
        projectId: 'project-1',
        currentFileBytes: '1024',
        expectedFileBytes: '2048',
        drift: '1024',
        fileBlobCount: 1,
        referenceCount: 2,
      },
    })

    const vm = new ProjectFileUsageViewModel(projectPermissions, permissionService)
    await Promise.resolve()

    expect(vm.hasManagePermission).toBe(true)
    expect(vm.canRestore).toBe(true)
    expect(vm.driftColor).toBe('orange.600')

    vm.dispose()
  })

  it('runs dry-run preview before apply and refreshes after success', async () => {
    permissionService.addProjectPermissions('project-1', [
      { id: 'manage-file-usage', action: 'manage', subject: 'FileUsage' },
    ])

    adminValidateProjectFileBytes
      .mockResolvedValueOnce({
        adminValidateProjectFileBytes: {
          projectId: 'project-1',
          currentFileBytes: '1024',
          expectedFileBytes: '2048',
          drift: '1024',
          fileBlobCount: 1,
          referenceCount: 2,
        },
      })
      .mockResolvedValueOnce({
        adminValidateProjectFileBytes: {
          projectId: 'project-1',
          currentFileBytes: '2048',
          expectedFileBytes: '2048',
          drift: '0',
          fileBlobCount: 1,
          referenceCount: 2,
        },
      })

    adminRestoreProjectFileBytes
      .mockResolvedValueOnce({
        adminRestoreProjectFileBytes: {
          projectId: 'project-1',
          previousFileBytes: '1024',
          nextFileBytes: '2048',
          drift: '1024',
          dryRun: true,
        },
      })
      .mockResolvedValueOnce({
        adminRestoreProjectFileBytes: {
          projectId: 'project-1',
          previousFileBytes: '1024',
          nextFileBytes: '2048',
          drift: '1024',
          dryRun: false,
        },
      })

    const vm = new ProjectFileUsageViewModel(projectPermissions, permissionService)
    await Promise.resolve()

    await vm.previewRestore()

    expect(adminRestoreProjectFileBytes).toHaveBeenNthCalledWith(1, {
      data: { projectId: 'project-1', dryRun: true },
    })
    expect(vm.restoreDialogOpen).toBe(true)
    expect(vm.previewPreviousBytesLabel).toBe('1.0 KB (1,024 bytes)')
    expect(vm.previewNextBytesLabel).toBe('2.0 KB (2,048 bytes)')

    await vm.applyRestore()

    expect(adminRestoreProjectFileBytes).toHaveBeenNthCalledWith(2, {
      data: { projectId: 'project-1', dryRun: false },
    })
    expect(adminValidateProjectFileBytes).toHaveBeenCalledTimes(2)
    expect(vm.drift).toBe('0')
    expect(vm.restoreDialogOpen).toBe(false)
    expect(toasterSuccess).toHaveBeenCalledWith({ description: 'Project file usage restored successfully' })

    vm.dispose()
  })

  it('surfaces restore errors inline', async () => {
    permissionService.addProjectPermissions('project-1', [
      { id: 'manage-file-usage', action: 'manage', subject: 'FileUsage' },
    ])

    adminValidateProjectFileBytes.mockResolvedValue({
      adminValidateProjectFileBytes: {
        projectId: 'project-1',
        currentFileBytes: '1024',
        expectedFileBytes: '2048',
        drift: '1024',
        fileBlobCount: 1,
        referenceCount: 2,
      },
    })

    adminRestoreProjectFileBytes.mockRejectedValue(createClientError('Forbidden', 403))

    const vm = new ProjectFileUsageViewModel(projectPermissions, permissionService)
    await Promise.resolve()

    await vm.previewRestore()

    expect(vm.restoreDialogOpen).toBe(true)
    expect(vm.restoreError).toBe('Forbidden')

    vm.dispose()
  })

  it('clears stale validate data before a new request', async () => {
    permissionService.addProjectPermissions('project-1', [
      { id: 'manage-file-usage', action: 'manage', subject: 'FileUsage' },
    ])

    adminValidateProjectFileBytes
      .mockResolvedValueOnce({
        adminValidateProjectFileBytes: {
          projectId: 'project-1',
          currentFileBytes: '1024',
          expectedFileBytes: '2048',
          drift: '1024',
          fileBlobCount: 1,
          referenceCount: 2,
        },
      })
      .mockRejectedValueOnce(createClientError('Validate failed', 500))

    const vm = new ProjectFileUsageViewModel(projectPermissions, permissionService)
    await Promise.resolve()

    expect(vm.currentBytesLabel).toBe('1.0 KB (1,024 bytes)')

    await vm.validate()

    expect(vm.validateError).toBe('Validate failed')
    expect(vm.currentBytesLabel).toBe('0 B (0 bytes)')
    expect(vm.expectedBytesLabel).toBe('0 B (0 bytes)')
    expect(vm.driftLabel).toBe('0 B (0 bytes)')

    vm.dispose()
  })
})
