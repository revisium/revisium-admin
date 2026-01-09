import { IconType } from 'react-icons'
import { PiCheckCircleLight, PiLockLight, PiSkipForwardLight, PiWarningCircleLight } from 'react-icons/pi'
import { MigrationDiffStatus } from './types.ts'

export const diffStatusIcons: Record<MigrationDiffStatus, IconType> = {
  apply: PiCheckCircleLight,
  skip: PiSkipForwardLight,
  conflict: PiWarningCircleLight,
  blocked: PiLockLight,
}

export const diffStatusColors: Record<MigrationDiffStatus, string> = {
  apply: 'green.500',
  skip: 'gray.400',
  conflict: 'orange.500',
  blocked: 'gray.400',
}
