import { useEffect } from 'react'
import { SearchModalModel } from 'src/widgets/SearchModal'

export const useHotkeys = (model: SearchModalModel) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        model.openModal()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [model])

  useEffect(() => {
    if (!model.isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        model.closeModal()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        model.selectNext()
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        model.selectPrevious()
      } else if (e.key === 'Enter' && model.results.length > 0) {
        e.preventDefault()
        void model.navigateToSelected()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [model, model.isOpen])
}
