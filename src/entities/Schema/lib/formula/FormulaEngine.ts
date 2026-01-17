import { IReactionDisposer, reaction, runInAction } from 'mobx'
import { JsonArrayValueStore } from 'src/entities/Schema/model/value/json-array-value.store'
import { JsonValueStore, JsonValueStorePrimitives } from 'src/entities/Schema/model/value/json-value.store'
import { FormulaDependencyResolver } from './FormulaDependencyResolver'
import { FormulaEvaluator, FormulaEvaluatorOptions } from './FormulaEvaluator'
import { FormulaField, FormulaFieldCollector } from './FormulaFieldCollector'
import { FormulaPathResolver } from './FormulaPathResolver'

export type FormulaEngineOptions = FormulaEvaluatorOptions

export class FormulaEngine {
  private readonly pathResolver: FormulaPathResolver
  private readonly collector: FormulaFieldCollector
  private readonly dependencyResolver: FormulaDependencyResolver
  private readonly evaluator: FormulaEvaluator

  private formulaFields: Map<string, FormulaField> = new Map()
  private storeByPath: Map<string, JsonValueStorePrimitives> = new Map()
  private arrays: JsonArrayValueStore[] = []
  private evaluationOrder: string[] = []

  private valueDisposers: IReactionDisposer[] = []
  private structureDisposers: IReactionDisposer[] = []
  private isEvaluating = false

  constructor(
    private readonly root: JsonValueStore,
    options: FormulaEngineOptions = {},
  ) {
    this.pathResolver = new FormulaPathResolver()
    this.collector = new FormulaFieldCollector(this.pathResolver)
    this.dependencyResolver = new FormulaDependencyResolver(this.pathResolver)
    this.evaluator = new FormulaEvaluator(root, this.pathResolver, options)

    this.initialize()
  }

  public dispose(): void {
    this.disposeAllReactions()
    this.formulaFields.clear()
    this.storeByPath.clear()
    this.arrays = []
  }

  public reinitialize(): void {
    this.disposeValueReactions()

    const { formulaFields, storeByPath } = this.collector.collectFieldsOnly(this.root)
    this.formulaFields = formulaFields
    this.storeByPath = storeByPath
    this.evaluationOrder = this.dependencyResolver.buildEvaluationOrder(this.formulaFields)

    this.setupValueReactions()
    this.evaluateAll()
  }

  private initialize(): void {
    const { formulaFields, storeByPath, arrays } = this.collector.collect(this.root)
    this.formulaFields = formulaFields
    this.storeByPath = storeByPath
    this.arrays = arrays
    this.evaluationOrder = this.dependencyResolver.buildEvaluationOrder(this.formulaFields)

    this.setupStructureReactions()
    this.setupValueReactions()
    this.evaluateAll()
  }

  private disposeAllReactions(): void {
    this.disposeValueReactions()
    this.disposeStructureReactions()
  }

  private disposeValueReactions(): void {
    this.valueDisposers.forEach((dispose) => dispose())
    this.valueDisposers = []
  }

  private disposeStructureReactions(): void {
    this.structureDisposers.forEach((dispose) => dispose())
    this.structureDisposers = []
  }

  private setupStructureReactions(): void {
    for (const array of this.arrays) {
      const dispose = reaction(
        () => array.value.length,
        () => this.reinitialize(),
      )
      this.structureDisposers.push(dispose)
    }
  }

  private setupValueReactions(): void {
    const dependencyToFormulas = this.dependencyResolver.buildDependencyToFormulasMap(this.formulaFields)

    for (const [depPath, formulaPaths] of dependencyToFormulas) {
      const depStore = this.storeByPath.get(depPath)
      if (!depStore) {
        continue
      }

      const dispose = reaction(
        () => depStore.value,
        () => {
          if (!this.isEvaluating) {
            this.evaluateAffected(formulaPaths)
          }
        },
      )

      this.valueDisposers.push(dispose)
    }
  }

  private evaluateAll(): void {
    if (this.evaluationOrder.length === 0) {
      return
    }

    this.isEvaluating = true

    runInAction(() => {
      for (const path of this.evaluationOrder) {
        const field = this.formulaFields.get(path)
        if (field) {
          this.evaluator.evaluate(field)
        }
      }
    })

    this.isEvaluating = false
  }

  private evaluateAffected(formulaPaths: Set<string>): void {
    if (this.isEvaluating) {
      return
    }

    this.isEvaluating = true

    runInAction(() => {
      const toEvaluate = this.dependencyResolver.getAffectedFormulas(
        formulaPaths,
        this.evaluationOrder,
        this.formulaFields,
      )

      for (const path of toEvaluate) {
        const field = this.formulaFields.get(path)
        if (field) {
          this.evaluator.evaluate(field)
        }
      }
    })

    this.isEvaluating = false
  }
}
