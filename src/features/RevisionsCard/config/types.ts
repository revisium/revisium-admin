import { IconType } from 'src/features/RevisionsCard/config/icons.ts'

export type IRevisionCardItem = {
  index: number
  id: string
  tooltip: string[]
  link: string
  disabled: boolean
  children: IRevisionCardItem[]
  icon: IconType
  hidden?: boolean
  isThereEndpoint?: boolean
  dataTestId?: string
}

export enum Priority {
  None = 'None',
  Left = 'Left',
  Right = 'Right',
}
