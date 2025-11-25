import { diffChars } from 'diff'

export interface DiffPart {
  value: string
  type: 'added' | 'removed' | 'unchanged'
}

export const computeCharDiff = (oldValue: string, newValue: string): { oldParts: DiffPart[]; newParts: DiffPart[] } => {
  const changes = diffChars(oldValue, newValue)

  const oldParts: DiffPart[] = []
  const newParts: DiffPart[] = []

  for (const change of changes) {
    if (change.added) {
      newParts.push({ value: change.value, type: 'added' })
    } else if (change.removed) {
      oldParts.push({ value: change.value, type: 'removed' })
    } else {
      oldParts.push({ value: change.value, type: 'unchanged' })
      newParts.push({ value: change.value, type: 'unchanged' })
    }
  }

  return { oldParts, newParts }
}
