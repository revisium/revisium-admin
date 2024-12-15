import { cast, IAnyModelType, types } from 'mobx-state-tree'

export const createModelConnection = <T extends IAnyModelType>(name: string, model: T) => {
  return types
    .model(name, {
      totalCount: 0,
      hasNextPage: false,
      countLoaded: 0,
      edges: types.array(
        types.model({
          cursor: types.string,
          node: types.reference(model),
        }),
      ),
    })
    .views((self) => ({
      get startCursor() {
        return self.edges[0]?.cursor || null
      },

      get endCursor() {
        return self.edges[self.edges.length - 1]?.cursor || null
      },

      get availableNextPage() {
        return self.hasNextPage || self.countLoaded === 0
      },
    }))
    .actions((self) => ({
      reset() {
        self.totalCount = 0
        self.countLoaded = 0
        self.hasNextPage = false
        self.edges = cast([])
      },

      onLoad(data: OnLoad<string>) {
        self.countLoaded += 1
        self.totalCount = data.totalCount
        self.hasNextPage = data.hasNextPage
        self.edges.push(...data.edges)
      },

      removeEdge(cursor: string | undefined) {
        const foundNode = self.edges.find((edge) => edge.cursor === cursor)

        if (foundNode) {
          self.totalCount -= 1
          self.edges.remove(foundNode)
        }
      },

      replaceNode(cursor: string, node: T) {
        const foundItem = self.edges.find((edge) => edge.cursor === cursor)

        if (foundItem) {
          foundItem.node = cast(node)
        }
      },
    }))
}
export type EdgeNode<T> = { cursor: string; node: T }

type OnLoad<T> = { edges: EdgeNode<T>[]; hasNextPage: boolean; totalCount: number }

export type IConnection<T> = Readonly<
  {
    totalCount: number
    hasNextPage: boolean
    countLoaded: number
    edges: EdgeNode<T>[]
  } & {
    startCursor: string | null
    endCursor: string | null
    availableNextPage: boolean
  } & {
    reset(): void
    onLoad(data: OnLoad<string>): void
    removeEdge(cursor: string | undefined): void
    replaceNode(cursor: string, node: T): void
  }
>
