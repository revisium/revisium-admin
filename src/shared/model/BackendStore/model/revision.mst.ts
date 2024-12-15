import { cast, IAnyModelType, Instance, SnapshotOrInstance, tryReference, types } from 'mobx-state-tree'
import { EndpointModel, IEndpointModel, ISODate, ITableModel, TableModel } from 'src/shared/model/BackendStore/index.ts'
import {
  createModelConnection,
  IConnection,
} from 'src/shared/model/BackendStore/model-connection/createModelConnection.ts'

export const RevisionTablesConnection = createModelConnection(
  'RevisionTablesConnection',
  types.late(() => TableModel),
)

export const RevisionModel = types
  .model('RevisionModel', {
    id: types.identifier,
    createdAt: types.late(() => ISODate),
    comment: '',
    parent: types.maybe(types.reference(types.late((): IAnyModelType => RevisionModel))),
    isThereParent: types.optional(types.boolean, false),
    child: types.maybe(types.reference(types.late((): IAnyModelType => RevisionModel))),
    isThereChild: types.optional(types.boolean, false),
    childBranches: types.array(
      types.model({
        branchName: types.string,
        revisionStartId: types.string,
      }),
    ),
    endpoints: types.array(types.reference(types.late(() => EndpointModel))),
    tablesConnection: types.optional(RevisionTablesConnection, {}),
  })
  .actions((self) => ({
    addEndpoint(endpoint: Instance<typeof EndpointModel>) {
      self.endpoints.push(endpoint)
    },

    removeEndpoint(endpointId: string) {
      const foundEndpoint = self.endpoints.find((endpoint) => endpoint.id === endpointId)

      if (foundEndpoint) {
        self.endpoints.remove(foundEndpoint)
      }
    },

    update(revisionSnapshot: SnapshotOrInstance<typeof RevisionModel>) {
      if (revisionSnapshot.comment) {
        self.comment = revisionSnapshot.comment
      }

      if (revisionSnapshot.parent) {
        self.parent = cast(revisionSnapshot.parent)
      }
      if (revisionSnapshot.child) {
        self.child = cast(revisionSnapshot.child)
      }
      if (revisionSnapshot.childBranches) {
        self.childBranches = revisionSnapshot.childBranches
      }

      if (revisionSnapshot.endpoints) {
        self.endpoints = cast([])
        self.endpoints.push(...revisionSnapshot.endpoints)
      }
    },
  }))
  .views((self) => ({
    getParentsDetails(maxCount: number) {
      const loadedSequence: IRevisionModel[] = []

      if (!self.isThereParent) {
        return {
          isAllLoaded: true,
          loadedSequence,
        }
      }

      let revision = tryReference(() => self.parent)

      if (!revision) {
        return {
          isAllLoaded: false,
          loadedSequence,
        }
      }

      loadedSequence.push(revision)

      for (let currentCounter = 1; currentCounter < maxCount; currentCounter++) {
        if (!revision.isThereParent) {
          return {
            isAllLoaded: true,
            loadedSequence,
          }
        }

        revision = tryReference(() => revision.parent)
        if (!revision) {
          return {
            isAllLoaded: false,
            loadedSequence,
          }
        }

        loadedSequence.push(revision)
      }

      return {
        isAllLoaded: true,
        loadedSequence,
      }
    },

    getChildrenDetails(maxCount: number): RelationDetails {
      const loadedSequence: IRevisionModel[] = []

      if (!self.isThereChild) {
        return {
          isAllLoaded: true,
          loadedSequence,
        }
      }

      let revision = tryReference(() => self.child)

      if (!revision) {
        return {
          isAllLoaded: false,
          loadedSequence,
        }
      }

      loadedSequence.push(revision)

      for (let currentCounter = 1; currentCounter < maxCount; currentCounter++) {
        if (!revision.isThereChild) {
          return {
            isAllLoaded: true,
            loadedSequence,
          }
        }

        revision = tryReference(() => revision.child)
        if (!revision) {
          return {
            isAllLoaded: false,
            loadedSequence,
          }
        }

        loadedSequence.push(revision)
      }

      return {
        isAllLoaded: true,
        loadedSequence,
      }
    },
  }))

export type IRevisionModelChildBranch = {
  branchName: string
  revisionStartId: string
}

export type RelationDetails = { isAllLoaded: boolean; loadedSequence: IRevisionModel[] }

export type IRevisionModelBase = Readonly<{
  id: string
  createdAt: Date | string
  comment: string
  isThereParent: boolean
  isThereChild: boolean
  childBranches: IRevisionModelChildBranch[]
}> & {
  addEndpoint(endpoint: IEndpointModel)
  removeEndpoint(id: string)
} & {
  getParentsDetails(maxCount: number): RelationDetails
  getChildrenDetails(maxCount: number): RelationDetails
}

export type IRevisionModel = IRevisionModelBase &
  Readonly<{
    parent?: IRevisionModel
    child?: IRevisionModel
    endpoints: ReadonlyArray<IEndpointModel>
    tablesConnection: IConnection<ITableModel>
  }>

export type IRevisionModelReferences = IRevisionModelBase &
  Readonly<{
    parent?: string | null
    child?: string | null
    endpoints: ReadonlyArray<string>
    tablesConnection: IConnection<string>
  }>
