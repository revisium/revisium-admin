export enum FilterFieldType {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  ForeignKey = 'foreignKey',
  File = 'file',
  DateTime = 'dateTime',
}

export enum SystemFieldId {
  Id = 'system:id',
  CreatedAt = 'system:createdAt',
  UpdatedAt = 'system:updatedAt',
  PublishedAt = 'system:publishedAt',
  VersionId = 'system:versionId',
  CreatedId = 'system:createdId',
}
