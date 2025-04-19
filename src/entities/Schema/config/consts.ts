export enum ViewerSwitcherMode {
  Tree = 'Tree',
  Json = 'Json',
  RefBy = 'RefBy',
}

export enum SystemSchemaIds {
  File = 'urn:jsonschema:io:revisium:file-schema:1.0.0',
}

export const getLabelByRef = (ref: string) => {
  if (ref === SystemSchemaIds.File) {
    return 'File'
  }
}
