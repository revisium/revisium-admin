export enum FilterFieldType {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  ForeignKey = 'foreignKey',
  File = 'file',
  DateTime = 'dateTime',
}

export enum SystemFieldId {
  Id = 'id',
  CreatedAt = 'createdAt',
  UpdatedAt = 'updatedAt',
  PublishedAt = 'publishedAt',
  VersionId = 'versionId',
  CreatedId = 'createdId',
}

export const ROW_LEVEL_SYSTEM_FIELDS = new Set<SystemFieldId>([
  SystemFieldId.Id,
  SystemFieldId.CreatedAt,
  SystemFieldId.UpdatedAt,
])
