import { PermissionService } from '../PermissionService'
import { SystemPermissions, SystemRoleData } from '../SystemPermissions'

const createPermission = (id: string, action: string, subject: string, condition?: unknown) => ({
  id,
  action,
  subject,
  condition,
})

const createRole = (permissions: ReturnType<typeof createPermission>[]): SystemRoleData => ({
  id: 'role-1',
  name: 'Test Role',
  permissions,
})

describe('SystemPermissions', () => {
  let permissionService: PermissionService
  let systemPermissions: SystemPermissions

  beforeEach(() => {
    permissionService = new PermissionService()
    systemPermissions = new SystemPermissions(permissionService)
  })

  describe('setUserRole', () => {
    it('should set permissions from role', () => {
      const role = createRole([createPermission('read-user', 'read', 'User')])

      systemPermissions.setUserRole(role)

      expect(systemPermissions.canReadUser).toBe(true)
    })

    it('should handle null role', () => {
      systemPermissions.setUserRole(null)

      expect(systemPermissions.canReadUser).toBe(false)
    })

    it('should handle role without permissions', () => {
      const role: SystemRoleData = { id: 'role-1', name: 'Empty', permissions: [] }

      systemPermissions.setUserRole(role)

      expect(systemPermissions.canReadUser).toBe(false)
    })

    it('should set multiple permissions', () => {
      const role = createRole([
        createPermission('read-user', 'read', 'User'),
        createPermission('create-user', 'create', 'User'),
        createPermission('create-project', 'create', 'Project'),
      ])

      systemPermissions.setUserRole(role)

      expect(systemPermissions.canReadUser).toBe(true)
      expect(systemPermissions.canCreateUser).toBe(true)
      expect(systemPermissions.canCreateProject).toBe(true)
    })
  })

  describe('clearAll', () => {
    it('should clear all permissions', () => {
      const role = createRole([
        createPermission('read-user', 'read', 'User'),
        createPermission('create-project', 'create', 'Project'),
      ])
      systemPermissions.setUserRole(role)

      expect(systemPermissions.canReadUser).toBe(true)

      systemPermissions.clearAll()

      expect(systemPermissions.canReadUser).toBe(false)
      expect(systemPermissions.canCreateProject).toBe(false)
    })
  })

  describe('project permissions', () => {
    it('canCreateProject should check create permission', () => {
      expect(systemPermissions.canCreateProject).toBe(false)

      systemPermissions.setUserRole(createRole([createPermission('create-project', 'create', 'Project')]))

      expect(systemPermissions.canCreateProject).toBe(true)
    })
  })

  describe('user permissions', () => {
    it('canReadUser should check read permission', () => {
      expect(systemPermissions.canReadUser).toBe(false)

      systemPermissions.setUserRole(createRole([createPermission('read-user', 'read', 'User')]))

      expect(systemPermissions.canReadUser).toBe(true)
    })

    it('canCreateUser should check create permission', () => {
      expect(systemPermissions.canCreateUser).toBe(false)

      systemPermissions.setUserRole(createRole([createPermission('create-user', 'create', 'User')]))

      expect(systemPermissions.canCreateUser).toBe(true)
    })

    it('canAddUser should check add permission', () => {
      expect(systemPermissions.canAddUser).toBe(false)

      systemPermissions.setUserRole(createRole([createPermission('add-user', 'add', 'User')]))

      expect(systemPermissions.canAddUser).toBe(true)
    })

    it('canUpdateUser should check update permission', () => {
      expect(systemPermissions.canUpdateUser).toBe(false)

      systemPermissions.setUserRole(createRole([createPermission('update-user', 'update', 'User')]))

      expect(systemPermissions.canUpdateUser).toBe(true)
    })

    it('canDeleteUser should check delete permission', () => {
      expect(systemPermissions.canDeleteUser).toBe(false)

      systemPermissions.setUserRole(createRole([createPermission('delete-user', 'delete', 'User')]))

      expect(systemPermissions.canDeleteUser).toBe(true)
    })

    describe('canManageUsers', () => {
      it('should be true if canAddUser', () => {
        systemPermissions.setUserRole(createRole([createPermission('add-user', 'add', 'User')]))

        expect(systemPermissions.canManageUsers).toBe(true)
      })

      it('should be true if canReadUser', () => {
        systemPermissions.setUserRole(createRole([createPermission('read-user', 'read', 'User')]))

        expect(systemPermissions.canManageUsers).toBe(true)
      })

      it('should be false if no user permissions', () => {
        systemPermissions.setUserRole(createRole([createPermission('create-project', 'create', 'Project')]))

        expect(systemPermissions.canManageUsers).toBe(false)
      })
    })
  })

  describe('organization permissions', () => {
    it('canReadOrganization should check read permission', () => {
      expect(systemPermissions.canReadOrganization).toBe(false)

      systemPermissions.setUserRole(createRole([createPermission('read-org', 'read', 'Organization')]))

      expect(systemPermissions.canReadOrganization).toBe(true)
    })

    it('canUpdateOrganization should check update permission', () => {
      expect(systemPermissions.canUpdateOrganization).toBe(false)

      systemPermissions.setUserRole(createRole([createPermission('update-org', 'update', 'Organization')]))

      expect(systemPermissions.canUpdateOrganization).toBe(true)
    })

    it('canDeleteOrganization should check delete permission', () => {
      expect(systemPermissions.canDeleteOrganization).toBe(false)

      systemPermissions.setUserRole(createRole([createPermission('delete-org', 'delete', 'Organization')]))

      expect(systemPermissions.canDeleteOrganization).toBe(true)
    })
  })

  describe('system admin scenario', () => {
    it('should have full access with admin permissions', () => {
      const adminRole = createRole([
        createPermission('read-user', 'read', 'User'),
        createPermission('create-user', 'create', 'User'),
        createPermission('add-user', 'add', 'User'),
        createPermission('update-user', 'update', 'User'),
        createPermission('delete-user', 'delete', 'User'),
        createPermission('create-project', 'create', 'Project'),
        createPermission('read-org', 'read', 'Organization'),
        createPermission('update-org', 'update', 'Organization'),
        createPermission('delete-org', 'delete', 'Organization'),
      ])

      systemPermissions.setUserRole(adminRole)

      expect(systemPermissions.canReadUser).toBe(true)
      expect(systemPermissions.canCreateUser).toBe(true)
      expect(systemPermissions.canAddUser).toBe(true)
      expect(systemPermissions.canUpdateUser).toBe(true)
      expect(systemPermissions.canDeleteUser).toBe(true)
      expect(systemPermissions.canManageUsers).toBe(true)
      expect(systemPermissions.canCreateProject).toBe(true)
      expect(systemPermissions.canReadOrganization).toBe(true)
      expect(systemPermissions.canUpdateOrganization).toBe(true)
      expect(systemPermissions.canDeleteOrganization).toBe(true)
    })
  })

  describe('regular user scenario', () => {
    it('should have limited access', () => {
      const userRole = createRole([createPermission('create-project', 'create', 'Project')])

      systemPermissions.setUserRole(userRole)

      expect(systemPermissions.canCreateProject).toBe(true)
      expect(systemPermissions.canReadUser).toBe(false)
      expect(systemPermissions.canCreateUser).toBe(false)
      expect(systemPermissions.canManageUsers).toBe(false)
    })
  })
})
