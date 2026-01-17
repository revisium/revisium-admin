import { buildDependencyGraph, getTopologicalOrder } from '@revisium/formula'
import { FormulaField } from './FormulaFieldCollector'
import { FormulaPathResolver } from './FormulaPathResolver'

export class FormulaDependencyResolver {
  constructor(private readonly pathResolver: FormulaPathResolver) {}

  public buildEvaluationOrder(formulaFields: Map<string, FormulaField>): string[] {
    if (formulaFields.size === 0) {
      return []
    }

    const dependencies = this.buildDependencies(formulaFields)
    const graph = buildDependencyGraph(dependencies)
    const result = getTopologicalOrder(graph)

    if (!result.success) {
      console.error('FormulaEngine: Circular dependency detected:', result.error)
      return []
    }

    return result.order.filter((path) => formulaFields.has(path))
  }

  public buildDependencyToFormulasMap(formulaFields: Map<string, FormulaField>): Map<string, Set<string>> {
    const dependencyToFormulas = new Map<string, Set<string>>()

    for (const [formulaPath, field] of formulaFields) {
      for (const dep of field.dependencies) {
        const resolvedDep = this.pathResolver.resolveDependencyPath(dep, field.parentPath)
        const dependentFormulas = dependencyToFormulas.get(resolvedDep) ?? new Set()
        dependentFormulas.add(formulaPath)
        dependencyToFormulas.set(resolvedDep, dependentFormulas)
      }
    }

    return dependencyToFormulas
  }

  public getAffectedFormulas(
    formulaPaths: Set<string>,
    evaluationOrder: string[],
    formulaFields: Map<string, FormulaField>,
  ): string[] {
    const affectedSet = new Set(formulaPaths)

    return evaluationOrder.filter((path) => {
      if (affectedSet.has(path)) {
        return true
      }

      const field = formulaFields.get(path)
      if (!field) {
        return false
      }

      for (const dep of field.dependencies) {
        const resolvedDep = this.pathResolver.resolveDependencyPath(dep, field.parentPath)
        if (affectedSet.has(resolvedDep)) {
          affectedSet.add(path)
          return true
        }
      }

      return false
    })
  }

  private buildDependencies(formulaFields: Map<string, FormulaField>): Record<string, string[]> {
    const dependencies: Record<string, string[]> = {}

    for (const [path, field] of formulaFields) {
      const resolvedDeps = field.dependencies
        .map((dep) => this.pathResolver.resolveDependencyPath(dep, field.parentPath))
        .filter((dep) => formulaFields.has(dep))

      dependencies[path] = resolvedDeps
    }

    return dependencies
  }
}
