import { computed } from 'mobx'
import { cast, SnapshotOrInstance, types } from 'mobx-state-tree'
import { nanoid } from 'nanoid'
import {
  BranchModel,
  EndpointModel,
  IBranchModel,
  IBranchModelReferences,
  IEndpointModel,
  IProjectModel,
  IProjectModelReferences,
  IRevisionModel,
  IRevisionModelReferences,
  IRowModel,
  IRowModelReferences,
  IRowForeignKeysByModel,
  ITableModel,
  ITableModelReferences,
  ProjectModel,
  RevisionModel,
  RowModel,
  RowForeignKeysByModel,
  TableModel,
} from 'src/shared/model/BackendStore/model'
import {
  IOrganizationModel,
  IOrganizationModelReferences,
  OrganizationModel,
} from 'src/shared/model/BackendStore/model/organization.mst.ts'

type ProjectVariables = { organizationId: string; projectName: string }
type BranchVariables = ProjectVariables & { branchName: string }
type TableVariables = { revisionId: string; tableId: string }
type RowVariables = { revisionId: string; tableId: string; rowId: string }
type RowForeignKeysByVariables = { revisionId: string; tableId: string; rowId: string }

const getVariablesKey = <T extends Record<string, unknown>>(variables: T) => JSON.stringify(variables)

export const CacheModel = types
  .model({
    id: types.identifier,
    organization: types.map(types.late(() => OrganizationModel)),
    project: types.map(types.late(() => ProjectModel)),
    projectByVariables: types.map(types.reference(types.late(() => ProjectModel))),
    branch: types.map(types.late(() => BranchModel)),
    branchByVariables: types.map(types.reference(types.late(() => BranchModel))),
    revision: types.map(types.late(() => RevisionModel)),
    endpoint: types.map(types.late(() => EndpointModel)),
    table: types.map(types.late(() => TableModel)),
    tableByVariables: types.map(types.reference(types.late(() => TableModel))),
    row: types.map(types.late(() => RowModel)),
    rowByVariables: types.map(types.reference(types.late(() => RowModel))),
    rowForeignKeysBy: types.map(types.late(() => RowForeignKeysByModel)),
    rowForeignKeysByByVariables: types.map(types.reference(types.late(() => RowForeignKeysByModel))),
  })
  .views((self) => ({
    getOrganization(id: string) {
      return computed(() => self.organization.get(id)).get()
    },

    getProject(id: string) {
      return computed(() => self.project.get(id)).get()
    },

    getProjectByVariables({ organizationId, projectName }: ProjectVariables) {
      return computed(() => {
        return self.projectByVariables.get(getVariablesKey({ organizationId, projectName }))
      }).get()
    },

    getBranch(id: string) {
      return computed(() => self.branch.get(id)).get()
    },

    getBranchByVariables({ organizationId, projectName, branchName }: BranchVariables) {
      return computed(() => {
        return self.branchByVariables.get(getVariablesKey({ organizationId, projectName, branchName }))
      }).get()
    },

    getRevision(id: string) {
      return computed(() => self.revision.get(id)).get()
    },

    getEndpoint(id: string) {
      return computed(() => self.endpoint.get(id)).get()
    },

    getTable(id: string) {
      return computed(() => self.table.get(id)).get()
    },

    getTableByVariables({ revisionId, tableId }: TableVariables) {
      return computed(() => {
        return self.tableByVariables.get(getVariablesKey({ revisionId, tableId }))
      }).get()
    },

    getRow(id: string) {
      return computed(() => self.row.get(id)).get()
    },

    getRowByVariables({ revisionId, tableId, rowId }: RowVariables) {
      return computed(() => {
        return self.rowByVariables.get(getVariablesKey({ revisionId, tableId, rowId }))
      }).get()
    },

    getRowForeignKeysByVariables({ revisionId, tableId, rowId }: RowVariables) {
      return computed(() => {
        return self.rowForeignKeysByByVariables.get(getVariablesKey({ revisionId, tableId, rowId }))
      }).get()
    },
  }))
  .actions((self) => ({
    addOrganization(organizationSnapshot: SnapshotOrInstance<typeof OrganizationModel>) {
      const organization = self.organization.get(organizationSnapshot.id)
      if (!organization) {
        return self.organization.put(organizationSnapshot)
      } else {
        // TODO partial update
        return organization
      }
    },

    addProject(projectSnapshot: SnapshotOrInstance<typeof ProjectModel>) {
      const project = self.project.get(projectSnapshot.id)
      if (!project) {
        return self.project.put(projectSnapshot)
      } else {
        // TODO partial update
        return project
      }
    },

    addProjectByVariables({ organizationId, projectName }: ProjectVariables, id: string) {
      self.projectByVariables.set(getVariablesKey({ organizationId, projectName }), id)
    },

    addOrUpdateBranch(branchSnapshot: SnapshotOrInstance<typeof BranchModel>) {
      const branch = self.branch.get(branchSnapshot.id)
      if (!branch) {
        return self.branch.put(branchSnapshot)
      } else {
        branch.touched = branchSnapshot.touched

        branch.start = cast(branchSnapshot.start)
        branch.head = cast(branchSnapshot.head)
        branch.draft = cast(branchSnapshot.draft)
        return branch
      }
    },

    addBranchByVariables({ organizationId, projectName, branchName }: BranchVariables, id: string) {
      self.branchByVariables.set(getVariablesKey({ organizationId, projectName, branchName }), id)
    },

    addOrUpdateRevision(revisionSnapshot: SnapshotOrInstance<typeof RevisionModel>) {
      const revision = self.revision.get(revisionSnapshot.id)

      if (!revision) {
        return self.revision.put(revisionSnapshot)
      } else {
        revision.update(revisionSnapshot)
        return revision
      }
    },

    addEndpoint(endpointSnapshot: SnapshotOrInstance<typeof EndpointModel>) {
      const endpoint = self.endpoint.get(endpointSnapshot.id)

      if (!endpoint) {
        return self.endpoint.put(endpointSnapshot)
      } else {
        return endpoint
      }
    },

    addOrTable(tableSnapshot: SnapshotOrInstance<typeof TableModel>) {
      const table = self.table.get(tableSnapshot.versionId)
      if (!table) {
        return self.table.put(tableSnapshot)
      } else {
        table.readonly = tableSnapshot.readonly
        table.createdAt = cast(tableSnapshot.createdAt)
        table.id = tableSnapshot.id
        if (tableSnapshot.count) {
          table.count = tableSnapshot.count
        }
        if (tableSnapshot.schema) {
          table.schema = cast(tableSnapshot.schema)
        }
        return table
      }
    },

    addTableByVariables({ revisionId, tableId }: TableVariables, tableVersionId: string) {
      self.tableByVariables.set(getVariablesKey({ revisionId, tableId }), tableVersionId)
    },

    addRow(rowSnapshot: SnapshotOrInstance<typeof RowModel>) {
      const row = self.row.get(rowSnapshot.versionId)
      if (!row) {
        return self.row.put(rowSnapshot)
      } else {
        row.update(rowSnapshot)
        return row
      }
    },

    addRowByVariables({ revisionId, tableId, rowId }: RowVariables, rowVersionId: string) {
      self.rowByVariables.set(getVariablesKey({ revisionId, tableId, rowId }), rowVersionId)
    },

    createRowForeignKeysByByVariables({ revisionId, tableId, rowId }: RowForeignKeysByVariables) {
      const rowForeignKeysBy = RowForeignKeysByModel.create({
        id: nanoid(),
        countForeignKeysBy: 0,
      })

      self.rowForeignKeysBy.put(rowForeignKeysBy)
      self.rowForeignKeysByByVariables.set(getVariablesKey({ revisionId, tableId, rowId }), rowForeignKeysBy.id)

      return rowForeignKeysBy
    },
  }))

export type ICacheModel = Readonly<
  {
    organization: Map<string, IOrganizationModel>
    project: Map<string, IProjectModel>
    projectByVariables: Map<string, IProjectModel>
    branch: Map<string, IBranchModel>
    branchByVariables: Map<string, IBranchModel>
    revision: Map<string, IRevisionModel>
    endpoint: Map<string, IEndpointModel>
    table: Map<string, ITableModel>
    tableByVariables: Map<string, ITableModel>
    row: Map<string, IRowModel>
  } & {
    getOrganization(id: string): IOrganizationModel | undefined
    getProject(id: string): IProjectModel | undefined
    getProjectByVariables(variables: { organizationId: string; projectName: string }): IProjectModel | undefined
    getBranch(id: string): IBranchModel | undefined
    getBranchByVariables(variables: BranchVariables): IBranchModel | undefined
    getRevision(id: string): IRevisionModel | undefined
    getEndpoint(id: string): IEndpointModel | undefined
    getTable(id: string): ITableModel | undefined
    getTableByVariables(variables: TableVariables): ITableModel | undefined
    getRow(id: string): IRowModel | undefined
    getRowByVariables(variables: RowVariables): IRowModel | undefined
    getRowForeignKeysByVariables(variables: RowForeignKeysByVariables): IRowForeignKeysByModel | undefined
  } & {
    addOrganization(organizationSnapshot: Partial<IOrganizationModelReferences>): IOrganizationModel
    addProject(projectSnapshot: Partial<IProjectModelReferences>): IProjectModel
    addProjectByVariables(variables: { organizationId: string; projectName: string }, projectId: string): IProjectModel
    addOrUpdateBranch(branchSnapshot: Partial<IBranchModelReferences>): IBranchModel
    addBranchByVariables(variables: BranchVariables, branchId: string): IBranchModel
    addOrUpdateRevision(revisionSnapshot: Partial<IRevisionModelReferences>): IRevisionModel
    addEndpoint(endpointSnapshot: Partial<IEndpointModel>): IEndpointModel
    addOrTable(tableSnapshot: Partial<ITableModelReferences>): ITableModel
    addTableByVariables(variables: TableVariables, tableVersionId: string): ITableModel
    addRow(rowSnapshot: Partial<IRowModelReferences>): IRowModel
    addRowByVariables(variables: RowVariables, rowVersionId: string): ITableModel
    createRowForeignKeysByByVariables(variables: RowForeignKeysByVariables): IRowForeignKeysByModel
  }
>
