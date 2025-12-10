export const isEditableTarget = (target: HTMLElement): boolean => {
  const isContentEditable = target.getAttribute('contenteditable') === 'true'
  const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'
  return isInput && !isContentEditable
}
