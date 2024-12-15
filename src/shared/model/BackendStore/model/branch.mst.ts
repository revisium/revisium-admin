import { types } from 'mobx-state-tree'
import { IRevisionModel, ISODate, RevisionModel } from 'src/shared/model/BackendStore/index.ts'

export const BranchModel = types
  .model('BranchModel', {
    id: types.identifier,
    name: types.string,
    createdAt: types.late(() => ISODate),
    touched: types.boolean,
    start: types.reference(types.late(() => RevisionModel)),
    head: types.reference(types.late(() => RevisionModel)),
    draft: types.reference(types.late(() => RevisionModel)),
    parentBranch: types.maybe(
      types.model({
        branchName: types.string,
        fromRevisionId: types.string,
      }),
    ),
  })
  .actions((self) => ({
    updateTouched(value: boolean) {
      self.touched = value
    },
  }))

export type IParentBranch = {
  branchName: string
  fromRevisionId: string
}

export type IBranchModelBase = Readonly<
  {
    id: string
    name: string
    createdAt: Date | string
    touched: boolean
    parentBranch?: IParentBranch
  } & { updateTouched: (value: boolean) => void }
>

export type IBranchModel = IBranchModelBase &
  Readonly<{
    start: IRevisionModel
    head: IRevisionModel
    draft: IRevisionModel
  }>

export type IBranchModelReferences = IBranchModelBase &
  Readonly<{
    start: string
    head: string
    draft: string
  }>
