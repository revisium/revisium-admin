export enum ViewerSwitcherMode {
  Tree = 'Tree',
  Json = 'Json',
  RefBy = 'RefBy',
}

export enum SystemSchemaIds {
  RowId = 'urn:jsonschema:io:revisium:row-id-schema:1.0.0',
  File = 'urn:jsonschema:io:revisium:file-schema:1.0.0',
}

const labels = {
  [SystemSchemaIds.RowId]: 'id',
  [SystemSchemaIds.File]: 'File',
}

export const getLabelByRef = (ref: string) => {
  return labels[ref]
}
