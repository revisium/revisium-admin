import { makeObservable, action } from 'mobx'
import { JsonArrayValueStore } from 'src/entities/Schema/model/value/json-array-value.store'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store.ts'
import { createNodeForStore } from 'src/widgets/TreeDataCard/lib/nodeFactory.ts'
import { BaseValueNode, MenuItem } from './BaseValueNode'
import { CreateItemValueNode } from './CreateItemValueNode'

export class ArrayValueNode extends BaseValueNode {
  private readonly createButtonNode: CreateItemValueNode

  constructor(private readonly store: JsonArrayValueStore) {
    super(store, 'array')

    this.createButtonNode = new CreateItemValueNode(store, () => {
      this.createItem()
    })
    this.createButtonNode.setParent(this)

    makeObservable(this, {
      createItem: action,
      createItemAt: action,
      deleteChild: action,
      moveItem: action,
    })

    this.buildChildren()

    this.expanded = true
  }

  public get menu(): MenuItem[] {
    return [
      ...super.topMenu,
      {
        value: 'array',
        label: 'Array',
        children: [
          ...(this.store.value.length > 0
            ? [
                {
                  value: 'add-first',
                  label: 'Add item to start',
                  handler: () => this.createItemAt(0),
                },
              ]
            : []),
          {
            value: 'add-item',
            label: 'Add item to end',
            handler: () => this.createItem(),
          },
        ],
      },
      ...this.additionalMenu,
      ...super.bottomMenu,
    ]
  }

  public get collapseChildrenLabel() {
    const count = (this._store as JsonArrayValueStore).value.length

    return `<${count} ${count === 1 ? 'item' : 'items'}>`
  }

  private buildChildren() {
    const existingNodesMap = new Map<JsonValueStore, BaseValueNode>()

    for (const child of this.children) {
      if (child !== this.createButtonNode) {
        existingNodesMap.set(child.getStore(), child)
      }
    }

    const itemNodes = this.store.value.map((itemStore) => {
      const existingNode = existingNodesMap.get(itemStore)
      if (existingNode) {
        this.updateNodeMenu(existingNode, itemStore)
        return existingNode
      }
      return this.createNodeFromStore(itemStore)
    })

    this.children = [...itemNodes, this.createButtonNode]
  }

  private updateNodeMenu(node: BaseValueNode, store: JsonValueStore) {
    node.additionalMenu = []

    const index = this.store.value.indexOf(store)
    const isFirst = index === 0
    const isLast = index === this.store.value.length - 1
    const hasMultipleItems = this.store.value.length > 1

    if (hasMultipleItems) {
      const moveMenu: MenuItem & { children: MenuItem[] } = {
        value: 'menu',
        label: 'Move',
        children: [],
      }

      node.additionalMenu.push(moveMenu)

      if (this.store.value.length > 2 && index > 1) {
        moveMenu.children.push({
          value: 'move-to-start',
          label: 'to start',
          handler: () => this.moveItem(index, 0),
        })
      }

      if (!isFirst) {
        moveMenu.children.push({
          value: 'move-up',
          label: 'up',
          handler: () => this.moveItem(index, index - 1),
        })
      }

      if (!isLast) {
        moveMenu.children.push({
          value: 'move-down',
          label: 'down',
          handler: () => this.moveItem(index, index + 1),
        })
      }

      if (this.store.value.length > 2 && index < this.store.value.length - 2) {
        moveMenu.children.push({
          value: 'move-to-end',
          label: 'to end',
          handler: () => this.moveItem(index, this.store.value.length - 1),
        })
      }
    }

    const arrayMenu: MenuItem = {
      value: 'item',
      label: 'Item',
      children: [
        {
          value: 'add-before',
          label: 'Add before',
          handler: () => this.createItemAt(index),
        },
        {
          value: 'add-after',
          label: 'Add after',
          handler: () => this.createItemAt(index + 1),
        },
      ],
    }

    node.additionalMenu.push(arrayMenu)
    node.additionalMenu.push({
      value: 'delete',
      label: 'Delete',
      handler: () => this.deleteChild(node),
      afterSeparator: true,
    })
  }

  private createNodeFromStore(store: JsonValueStore): BaseValueNode {
    const node = createNodeForStore(store)
    node.setParent(this)
    this.updateNodeMenu(node, store)
    return node
  }

  private addNewItem(store: JsonValueStore, index?: number) {
    const newNode = this.createNodeFromStore(store)

    if (index) {
      this.children.splice(index, 0, newNode)
    } else {
      this.children.splice(-1, 0, newNode)
    }
  }

  public createItem() {
    this.addNewItem(this.store.createItem())
    this.buildChildren()
  }

  public createItemAt(index: number) {
    const newStore = this.store.createItemAt(index)
    this.addNewItem(newStore, index)
    this.buildChildren()
  }

  public deleteChild(child: BaseValueNode) {
    const index = this.store.value.findIndex((item) => item === child.getStore())

    this.store.removeItem(index)
    this.children.splice(index, 1)
    this.buildChildren()
  }

  public moveItem(fromIndex: number, toIndex: number) {
    this.store.moveItem(fromIndex, toIndex)
    this.buildChildren()
  }
}
