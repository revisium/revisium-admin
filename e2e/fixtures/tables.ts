export function createTableFixture(tableId: string) {
  return {
    data: {
      table: {
        id: tableId,
        versionId: `${tableId}-v1`,
        readonly: false,
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string', default: '' },
            age: { type: 'number', default: 0 },
            active: { type: 'boolean', default: false },
          },
          additionalProperties: false,
          required: ['name', 'age', 'active'],
        },
      },
    },
  }
}

export function createTableSchemaFixture(tableId: string, schema: object) {
  return {
    data: {
      table: {
        id: tableId,
        versionId: `${tableId}-v1`,
        readonly: false,
        schema,
      },
    },
  }
}

export const simpleSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', default: '' },
    age: { type: 'number', default: 0 },
    active: { type: 'boolean', default: false },
  },
  additionalProperties: false,
  required: ['name', 'age', 'active'],
}
