import { UpdateRowMstMutation } from 'src/__generated__/graphql-request.ts'
import { container } from 'src/shared/lib'
import { AuthService } from 'src/shared/model/AuthService.ts'
import { EnvironmentService } from 'src/shared/model/EnvironmentService.ts'

export class FileService {
  constructor(
    private readonly authService: AuthService,
    private readonly environmentService: EnvironmentService,
  ) {}

  public async add({
    revisionId,
    tableId,
    rowId,
    fileId,
    file,
  }: {
    revisionId: string
    tableId: string
    rowId: string
    fileId: string
    file: File
  }): Promise<UpdateRowMstMutation['updateRow']> {
    const url = `${this.environmentService.get('REACT_APP_SWAGGER_SERVER_URL')}/revision/${revisionId}/tables/${tableId}/rows/${rowId}/upload/${fileId}`
    const response = await this.upload(url, file)

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    return response.json()
  }

  private async upload(signedUrl: string, file: File) {
    const formData = new FormData()
    formData.append('file', file, file.name)

    return fetch(signedUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.authService.token}`,
      },
      body: formData,
    })
  }
}

container.register(
  FileService,
  () => {
    const authService = container.get(AuthService)
    const environmentService = container.get(EnvironmentService)

    return new FileService(authService, environmentService)
  },
  { scope: 'singleton' },
)
