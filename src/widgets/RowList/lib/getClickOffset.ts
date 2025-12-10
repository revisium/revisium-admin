export interface CellPosition {
  top: number
  left: number
  width: number
  height: number
}

export const getClickOffset = (
  textElement: HTMLElement | null,
  displayValue: string | undefined,
  clientX: number,
): number | undefined => {
  if (!textElement || !displayValue) {
    return undefined
  }

  const textNode = textElement.firstChild
  if (!textNode || textNode.nodeType !== Node.TEXT_NODE) {
    return undefined
  }

  if (document.caretRangeFromPoint) {
    const range = document.caretRangeFromPoint(clientX, textElement.getBoundingClientRect().top + 10)
    if (range?.startContainer === textNode) {
      return range.startOffset
    }
  }

  const doc = document as Document & {
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null
  }
  if (doc.caretPositionFromPoint) {
    const pos = doc.caretPositionFromPoint(clientX, textElement.getBoundingClientRect().top + 10)
    if (pos?.offsetNode === textNode) {
      return pos.offset
    }
  }

  const rect = textElement.getBoundingClientRect()
  const clickX = clientX - rect.left
  const textWidth = textElement.scrollWidth
  const charWidth = textWidth / displayValue.length
  return Math.max(0, Math.min(displayValue.length, Math.round(clickX / charWidth)))
}

export const getCellPosition = (cellElement: HTMLElement | null): CellPosition | undefined => {
  if (!cellElement) {
    return undefined
  }

  const rect = cellElement.getBoundingClientRect()
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  }
}
