type PathSegment = { type: 'field'; name: string } | { type: 'index'; index: number }

export class FormulaPathResolver {
  public resolveDependencyPath(dependency: string, parentPath: string): string {
    if (dependency.startsWith('/')) {
      return dependency.slice(1)
    }

    if (dependency.startsWith('../')) {
      return this.resolveRelativePath(dependency, parentPath)
    }

    if (parentPath) {
      return `${parentPath}.${dependency}`
    }

    return dependency
  }

  public getParentPath(path: string): string {
    const lastDot = path.lastIndexOf('.')
    const lastBracket = path.lastIndexOf('[')
    const lastSeparator = Math.max(lastDot, lastBracket)

    if (lastSeparator === -1) {
      return ''
    }

    return path.slice(0, lastSeparator)
  }

  public getValueByPath(obj: Record<string, unknown>, path: string): unknown {
    if (!path) {
      return obj
    }

    const segments = this.parsePath(path)
    let current: unknown = obj

    for (const segment of segments) {
      if (current === null || current === undefined || typeof current !== 'object') {
        return undefined
      }

      if (segment.type === 'field') {
        current = (current as Record<string, unknown>)[segment.name]
      } else if (segment.type === 'index') {
        if (!Array.isArray(current)) {
          return undefined
        }
        current = current[segment.index]
      }
    }

    return current
  }

  private resolveRelativePath(dependency: string, parentPath: string): string {
    let currentParent = parentPath
    let remainingDep = dependency

    while (remainingDep.startsWith('../')) {
      remainingDep = remainingDep.slice(3)
      const lastDot = currentParent.lastIndexOf('.')
      const lastBracket = currentParent.lastIndexOf('[')
      const lastSeparator = Math.max(lastDot, lastBracket)
      currentParent = lastSeparator > 0 ? currentParent.slice(0, lastSeparator) : ''
    }

    return currentParent ? `${currentParent}.${remainingDep}` : remainingDep
  }

  private parsePath(path: string): PathSegment[] {
    const segments: PathSegment[] = []
    let current = ''
    let position = 0

    while (position < path.length) {
      const char = path[position]

      if (char === '.') {
        if (current) {
          segments.push({ type: 'field', name: current })
          current = ''
        }
        position++
      } else if (char === '[') {
        if (current) {
          segments.push({ type: 'field', name: current })
          current = ''
        }
        const endBracket = path.indexOf(']', position)
        if (endBracket === -1) {
          position++
        } else {
          const indexStr = path.slice(position + 1, endBracket)
          segments.push({ type: 'index', index: parseInt(indexStr, 10) })
          position = endBracket + 1
        }
      } else {
        current += char
        position++
      }
    }

    if (current) {
      segments.push({ type: 'field', name: current })
    }

    return segments
  }
}
