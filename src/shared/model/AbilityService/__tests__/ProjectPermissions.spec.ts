import { PermissionService } from '../PermissionService'
import { IProjectContextData, ProjectPermissions } from '../ProjectPermissions'

const createPermission = (id: string, action: string, subject: string, condition?: Record<string, unknown> | null) => ({
  id,
  action,
  subject,
  condition: condition ?? null,
})

const createContext = (overrides: Partial<IProjectContextData> = {}): IProjectContextData => ({
  projectId: 'proj-1',
  organizationId: 'org-1',
  isPublic: false,
  projectRoleName: 'Editor',
  ...overrides,
})

describe('ProjectPermissions', () => {
  let permissionService: PermissionService
  let projectPermissions: ProjectPermissions
  let contextData: IProjectContextData

  const setContext = (context: IProjectContextData) => {
    contextData = context
  }

  beforeEach(() => {
    permissionService = new PermissionService()
    projectPermissions = new ProjectPermissions(permissionService)
    contextData = createContext()
    projectPermissions.setContextProvider(() => contextData)
  })

  describe('context management', () => {
    it('should read context from provider', () => {
      setContext(createContext())

      expect(projectPermissions.projectId).toBe('proj-1')
      expect(projectPermissions.organizationId).toBe('org-1')
      expect(projectPermissions.isPublic).toBe(false)
      expect(projectPermissions.projectRoleName).toBe('Editor')
    })

    it('should react to context changes', () => {
      setContext(createContext())
      expect(projectPermissions.projectId).toBe('proj-1')

      setContext(createContext({ projectId: 'proj-2' }))
      expect(projectPermissions.projectId).toBe('proj-2')
    })

    it('should handle public projects', () => {
      setContext(createContext({ isPublic: true }))

      expect(projectPermissions.isPublic).toBe(true)
    })

    it('should return defaults when no provider set', () => {
      const fresh = new ProjectPermissions(permissionService)

      expect(fresh.projectId).toBeNull()
      expect(fresh.organizationId).toBeNull()
      expect(fresh.isPublic).toBe(false)
      expect(fresh.projectRoleName).toBeNull()
    })
  })

  describe('project permissions', () => {
    it('canReadProject should check read permission with isPublic', () => {
      permissionService.addProjectPermissions('proj-1', [
        createPermission('read-project-private', 'read', 'Project', { isPublic: false }),
      ])

      expect(projectPermissions.canReadProject).toBe(true)
    })

    it('canReadProject should fail for public project without public permission', () => {
      setContext(createContext({ isPublic: true }))
      permissionService.addProjectPermissions('proj-1', [
        createPermission('read-project-private', 'read', 'Project', { isPublic: false }),
      ])

      expect(projectPermissions.canReadProject).toBe(false)
    })

    it('canUpdateProject should check update permission', () => {
      expect(projectPermissions.canUpdateProject).toBe(false)

      permissionService.addProjectPermissions('proj-1', [createPermission('update-project', 'update', 'Project')])

      expect(projectPermissions.canUpdateProject).toBe(true)
    })

    it('canDeleteProject should check delete permission', () => {
      expect(projectPermissions.canDeleteProject).toBe(false)

      permissionService.addProjectPermissions('proj-1', [createPermission('delete-project', 'delete', 'Project')])

      expect(projectPermissions.canDeleteProject).toBe(true)
    })
  })

  describe('branch permissions', () => {
    it('canReadBranch should check read permission', () => {
      permissionService.addProjectPermissions('proj-1', [createPermission('read-branch', 'read', 'Branch')])

      expect(projectPermissions.canReadBranch).toBe(true)
    })

    it('canCreateBranch should check create permission', () => {
      expect(projectPermissions.canCreateBranch).toBe(false)

      permissionService.addProjectPermissions('proj-1', [createPermission('create-branch', 'create', 'Branch')])

      expect(projectPermissions.canCreateBranch).toBe(true)
    })

    it('canDeleteBranch should check delete permission', () => {
      expect(projectPermissions.canDeleteBranch).toBe(false)

      permissionService.addProjectPermissions('proj-1', [createPermission('delete-branch', 'delete', 'Branch')])

      expect(projectPermissions.canDeleteBranch).toBe(true)
    })
  })

  describe('revision permissions', () => {
    it('canReadRevision should check read permission', () => {
      permissionService.addProjectPermissions('proj-1', [createPermission('read-revision', 'read', 'Revision')])

      expect(projectPermissions.canReadRevision).toBe(true)
    })

    it('canCreateRevision should check create permission', () => {
      expect(projectPermissions.canCreateRevision).toBe(false)

      permissionService.addProjectPermissions('proj-1', [createPermission('create-revision', 'create', 'Revision')])

      expect(projectPermissions.canCreateRevision).toBe(true)
    })

    it('canRevertRevision should check revert permission', () => {
      expect(projectPermissions.canRevertRevision).toBe(false)

      permissionService.addProjectPermissions('proj-1', [createPermission('revert-revision', 'revert', 'Revision')])

      expect(projectPermissions.canRevertRevision).toBe(true)
    })
  })

  describe('table permissions', () => {
    it('canReadTable should check read permission', () => {
      permissionService.addProjectPermissions('proj-1', [createPermission('read-table', 'read', 'Table')])

      expect(projectPermissions.canReadTable).toBe(true)
    })

    it('canCreateTable should check create permission', () => {
      expect(projectPermissions.canCreateTable).toBe(false)

      permissionService.addProjectPermissions('proj-1', [createPermission('create-table', 'create', 'Table')])

      expect(projectPermissions.canCreateTable).toBe(true)
    })

    it('canUpdateTable should check update permission', () => {
      expect(projectPermissions.canUpdateTable).toBe(false)

      permissionService.addProjectPermissions('proj-1', [createPermission('update-table', 'update', 'Table')])

      expect(projectPermissions.canUpdateTable).toBe(true)
    })

    it('canDeleteTable should check delete permission', () => {
      expect(projectPermissions.canDeleteTable).toBe(false)

      permissionService.addProjectPermissions('proj-1', [createPermission('delete-table', 'delete', 'Table')])

      expect(projectPermissions.canDeleteTable).toBe(true)
    })
  })

  describe('row permissions', () => {
    it('canReadRow should check read permission', () => {
      permissionService.addProjectPermissions('proj-1', [createPermission('read-row', 'read', 'Row')])

      expect(projectPermissions.canReadRow).toBe(true)
    })

    it('canCreateRow should check create permission', () => {
      expect(projectPermissions.canCreateRow).toBe(false)

      permissionService.addProjectPermissions('proj-1', [createPermission('create-row', 'create', 'Row')])

      expect(projectPermissions.canCreateRow).toBe(true)
    })

    it('canUpdateRow should check update permission', () => {
      expect(projectPermissions.canUpdateRow).toBe(false)

      permissionService.addProjectPermissions('proj-1', [createPermission('update-row', 'update', 'Row')])

      expect(projectPermissions.canUpdateRow).toBe(true)
    })

    it('canDeleteRow should check delete permission', () => {
      expect(projectPermissions.canDeleteRow).toBe(false)

      permissionService.addProjectPermissions('proj-1', [createPermission('delete-row', 'delete', 'Row')])

      expect(projectPermissions.canDeleteRow).toBe(true)
    })
  })

  describe('endpoint permissions', () => {
    it('canReadEndpoint should check read permission', () => {
      permissionService.addProjectPermissions('proj-1', [createPermission('read-endpoint', 'read', 'Endpoint')])

      expect(projectPermissions.canReadEndpoint).toBe(true)
    })

    it('canCreateEndpoint should check create permission', () => {
      expect(projectPermissions.canCreateEndpoint).toBe(false)

      permissionService.addProjectPermissions('proj-1', [createPermission('create-endpoint', 'create', 'Endpoint')])

      expect(projectPermissions.canCreateEndpoint).toBe(true)
    })

    it('canDeleteEndpoint should check delete permission', () => {
      expect(projectPermissions.canDeleteEndpoint).toBe(false)

      permissionService.addProjectPermissions('proj-1', [createPermission('delete-endpoint', 'delete', 'Endpoint')])

      expect(projectPermissions.canDeleteEndpoint).toBe(true)
    })
  })

  describe('user permissions (project-scoped)', () => {
    it('canAddUser should check add permission', () => {
      expect(projectPermissions.canAddUser).toBe(false)

      permissionService.addProjectPermissions('proj-1', [createPermission('add-user', 'add', 'User')])

      expect(projectPermissions.canAddUser).toBe(true)
    })

    it('canUpdateUser should check update permission', () => {
      expect(projectPermissions.canUpdateUser).toBe(false)

      permissionService.addProjectPermissions('proj-1', [createPermission('update-user', 'update', 'User')])

      expect(projectPermissions.canUpdateUser).toBe(true)
    })

    it('canDeleteUser should check delete permission', () => {
      expect(projectPermissions.canDeleteUser).toBe(false)

      permissionService.addProjectPermissions('proj-1', [createPermission('delete-user', 'delete', 'User')])

      expect(projectPermissions.canDeleteUser).toBe(true)
    })

    it('canReadUser should check read permission', () => {
      expect(projectPermissions.canReadUser).toBe(false)

      permissionService.addProjectPermissions('proj-1', [createPermission('read-user', 'read', 'User')])

      expect(projectPermissions.canReadUser).toBe(true)
    })

    describe('canManageUsers', () => {
      it('should be true if canAddUser', () => {
        permissionService.addProjectPermissions('proj-1', [createPermission('add-user', 'add', 'User')])

        expect(projectPermissions.canManageUsers).toBe(true)
      })

      it('should be true if canReadUser', () => {
        permissionService.addProjectPermissions('proj-1', [createPermission('read-user', 'read', 'User')])

        expect(projectPermissions.canManageUsers).toBe(true)
      })

      it('should be false if no user permissions', () => {
        permissionService.addProjectPermissions('proj-1', [createPermission('update-row', 'update', 'Row')])

        expect(projectPermissions.canManageUsers).toBe(false)
      })
    })
  })

  describe('composite permissions', () => {
    describe('canAccessSettings', () => {
      it('should be true if canUpdateProject', () => {
        permissionService.addProjectPermissions('proj-1', [createPermission('update-project', 'update', 'Project')])

        expect(projectPermissions.canAccessSettings).toBe(true)
      })

      it('should be true if canDeleteProject', () => {
        permissionService.addProjectPermissions('proj-1', [createPermission('delete-project', 'delete', 'Project')])

        expect(projectPermissions.canAccessSettings).toBe(true)
      })

      it('should be false if no project management permissions', () => {
        permissionService.addProjectPermissions('proj-1', [createPermission('update-row', 'update', 'Row')])

        expect(projectPermissions.canAccessSettings).toBe(false)
      })
    })

    describe('canWrite', () => {
      it('should be true if canCreateTable', () => {
        permissionService.addProjectPermissions('proj-1', [createPermission('create-table', 'create', 'Table')])

        expect(projectPermissions.canWrite).toBe(true)
        expect(projectPermissions.isReadOnly).toBe(false)
      })

      it('should be true if canUpdateTable', () => {
        permissionService.addProjectPermissions('proj-1', [createPermission('update-table', 'update', 'Table')])

        expect(projectPermissions.canWrite).toBe(true)
      })

      it('should be true if canDeleteTable', () => {
        permissionService.addProjectPermissions('proj-1', [createPermission('delete-table', 'delete', 'Table')])

        expect(projectPermissions.canWrite).toBe(true)
      })

      it('should be true if canCreateRow', () => {
        permissionService.addProjectPermissions('proj-1', [createPermission('create-row', 'create', 'Row')])

        expect(projectPermissions.canWrite).toBe(true)
      })

      it('should be true if canUpdateRow', () => {
        permissionService.addProjectPermissions('proj-1', [createPermission('update-row', 'update', 'Row')])

        expect(projectPermissions.canWrite).toBe(true)
      })

      it('should be true if canDeleteRow', () => {
        permissionService.addProjectPermissions('proj-1', [createPermission('delete-row', 'delete', 'Row')])

        expect(projectPermissions.canWrite).toBe(true)
      })
    })

    describe('isReadOnly', () => {
      it('should be true if cannot write', () => {
        permissionService.addProjectPermissions('proj-1', [
          createPermission('read-project-private', 'read', 'Project', { isPublic: false }),
        ])

        expect(projectPermissions.canWrite).toBe(false)
        expect(projectPermissions.isReadOnly).toBe(true)
      })
    })
  })

  describe('organization-level permissions', () => {
    it('should work with organization permissions', () => {
      permissionService.addOrganizationPermissions('org-1', [
        createPermission('create-row', 'create', 'Row'),
        createPermission('update-row', 'update', 'Row'),
      ])

      expect(projectPermissions.canCreateRow).toBe(true)
      expect(projectPermissions.canUpdateRow).toBe(true)
    })

    it('should not apply organization permissions from other orgs', () => {
      permissionService.addOrganizationPermissions('org-2', [createPermission('create-row', 'create', 'Row')])

      expect(projectPermissions.canCreateRow).toBe(false)
    })
  })

  describe('context isolation', () => {
    it('should not grant permissions without context', () => {
      const fresh = new ProjectPermissions(permissionService)
      permissionService.addProjectPermissions('proj-1', [createPermission('update-row', 'update', 'Row')])

      expect(fresh.canUpdateRow).toBe(false)
    })

    it('should not grant permissions for different project', () => {
      setContext(createContext({ projectId: 'proj-2' }))
      permissionService.addProjectPermissions('proj-1', [createPermission('update-row', 'update', 'Row')])

      expect(projectPermissions.canUpdateRow).toBe(false)
    })
  })

  describe('role-based scenarios', () => {
    it('Reader role should have read-only access', () => {
      permissionService.addProjectPermissions('proj-1', [
        createPermission('read-project-private', 'read', 'Project', { isPublic: false }),
      ])

      expect(projectPermissions.canReadProject).toBe(true)
      expect(projectPermissions.canReadTable).toBe(true)
      expect(projectPermissions.canReadRow).toBe(true)
      expect(projectPermissions.canWrite).toBe(false)
      expect(projectPermissions.isReadOnly).toBe(true)
    })

    it('Editor role should have row management access', () => {
      permissionService.addProjectPermissions('proj-1', [
        createPermission('read-project-private', 'read', 'Project', { isPublic: false }),
        createPermission('create-row', 'create', 'Row'),
        createPermission('update-row', 'update', 'Row'),
        createPermission('delete-row', 'delete', 'Row'),
        createPermission('create-revision', 'create', 'Revision'),
        createPermission('revert-revision', 'revert', 'Revision'),
      ])

      expect(projectPermissions.canCreateRow).toBe(true)
      expect(projectPermissions.canUpdateRow).toBe(true)
      expect(projectPermissions.canDeleteRow).toBe(true)
      expect(projectPermissions.canCreateRevision).toBe(true)
      expect(projectPermissions.canRevertRevision).toBe(true)
      expect(projectPermissions.canWrite).toBe(true)
      expect(projectPermissions.canCreateTable).toBe(false)
    })

    it('Developer role should have full table and branch management', () => {
      permissionService.addProjectPermissions('proj-1', [
        createPermission('read-project-private', 'read', 'Project', { isPublic: false }),
        createPermission('create-table', 'create', 'Table'),
        createPermission('update-table', 'update', 'Table'),
        createPermission('delete-table', 'delete', 'Table'),
        createPermission('create-branch', 'create', 'Branch'),
        createPermission('delete-branch', 'delete', 'Branch'),
        createPermission('create-endpoint', 'create', 'Endpoint'),
        createPermission('delete-endpoint', 'delete', 'Endpoint'),
      ])

      expect(projectPermissions.canCreateTable).toBe(true)
      expect(projectPermissions.canUpdateTable).toBe(true)
      expect(projectPermissions.canDeleteTable).toBe(true)
      expect(projectPermissions.canCreateBranch).toBe(true)
      expect(projectPermissions.canDeleteBranch).toBe(true)
      expect(projectPermissions.canCreateEndpoint).toBe(true)
      expect(projectPermissions.canDeleteEndpoint).toBe(true)
    })
  })
})
