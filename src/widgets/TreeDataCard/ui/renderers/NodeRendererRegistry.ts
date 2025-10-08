import React, { FC } from 'react'
import { BaseValueNode } from 'src/widgets/TreeDataCard/model/BaseValueNode.ts'
import { BooleanValueNode } from 'src/widgets/TreeDataCard/model/BooleanValueNode.ts'
import { CreateItemValueNode } from 'src/widgets/TreeDataCard/model/CreateItemValueNode.ts'
import { IdValueNode } from 'src/widgets/TreeDataCard/model/IdValueNode.ts'
import { NumberValueNode } from 'src/widgets/TreeDataCard/model/NumberValueNode.ts'
import { StringValueNode } from 'src/widgets/TreeDataCard/model/StringValueNode.ts'
import { NodeRendererContext } from './types'

import { CreateItemRendererComponent } from './CreateItemRenderer'
import { IdRendererComponent } from './IdRenderer'
import { FileRendererComponent } from './FileRenderer'
import { ContainerRendererComponent } from './ContainerRenderer'
import { ForeignKeyRendererComponent } from './ForeignKeyRenderer'
import { StringRendererComponent } from './StringRenderer'
import { NumberRendererComponent } from './NumberRenderer'
import { BooleanRendererComponent } from './BooleanRenderer'
import { DatePickerRendererComponent } from './DatePickerRenderer'

import { JsonSchemaTypeName } from 'src/entities/Schema/types/schema.types'
import { SystemSchemaIds } from 'src/entities/Schema/config/consts'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store'

interface RendererEntry {
  Component: FC<NodeRendererContext>
  canRender: (node: BaseValueNode, context: NodeRendererContext) => boolean
}

export class NodeRendererRegistry {
  private renderers: RendererEntry[] = []

  constructor() {
    this.registerDefaults()
  }

  private registerDefaults() {
    this.renderers = [
      {
        Component: CreateItemRendererComponent,
        canRender: (node) => node instanceof CreateItemValueNode,
      },
      {
        Component: IdRendererComponent,
        canRender: (node) => node instanceof IdValueNode,
      },
      {
        Component: DatePickerRendererComponent,
        canRender: (node) => {
          const nodeStore = node.getStore()
          return (
            nodeStore.type === JsonSchemaTypeName.String &&
            (nodeStore as JsonStringValueStore).$ref === SystemSchemaIds.RowPublishedAt
          )
        },
      },
      {
        Component: FileRendererComponent,
        canRender: (node) => {
          const nodeStore = node.getStore()
          return nodeStore.type === JsonSchemaTypeName.Object && nodeStore.$ref === SystemSchemaIds.File
        },
      },
      {
        Component: ContainerRendererComponent,
        canRender: (node: BaseValueNode) => node.hasChildren,
      },
      {
        Component: ForeignKeyRendererComponent,
        canRender: (node) => {
          const nodeStore = node.getStore()
          return nodeStore.type === JsonSchemaTypeName.String && Boolean(nodeStore.foreignKey)
        },
      },
      {
        Component: StringRendererComponent,
        canRender: (node) => node instanceof StringValueNode,
      },
      {
        Component: NumberRendererComponent,
        canRender: (node) => node instanceof NumberValueNode,
      },
      {
        Component: BooleanRendererComponent,
        canRender: (node) => node instanceof BooleanValueNode,
      },
    ]
  }

  render(context: NodeRendererContext) {
    for (const renderer of this.renderers) {
      if (renderer.canRender(context.node, context)) {
        return React.createElement(renderer.Component, context)
      }
    }

    throw new Error(`No renderer found for node type: ${context.node.nodeType}`)
  }
}

export const nodeRendererRegistry = new NodeRendererRegistry()
