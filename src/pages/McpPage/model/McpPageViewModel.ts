import { makeAutoObservable } from 'mobx'
import { ProjectContext } from 'src/entities/Project/model/ProjectContext.ts'
import { IViewModel } from 'src/shared/config/types.ts'
import { container, copyToClipboard, getOrigin } from 'src/shared/lib'

export class McpPageViewModel implements IViewModel {
  constructor(private readonly context: ProjectContext) {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  public get mcpUrl(): string {
    return `${getOrigin()}/mcp`
  }

  public get organizationId(): string {
    return this.context.organizationId
  }

  public get projectName(): string {
    return this.context.projectName
  }

  public get serverName(): string {
    const origin = getOrigin()
    const hostname = new URL(origin).hostname

    const parts = hostname.split('.').filter((part) => part.toLowerCase() !== 'revisium' && part !== 'www')

    const suffix = parts.length > 0 ? parts.join('-') : 'cloud'

    return `revisium-${suffix}`
  }

  public get claudeConfigSnippet(): string {
    return JSON.stringify(
      {
        mcpServers: {
          [this.serverName]: {
            url: this.mcpUrl,
          },
        },
      },
      null,
      2,
    )
  }

  public copyUrl(): void {
    void copyToClipboard(this.mcpUrl)
  }

  public copyConfig(): void {
    void copyToClipboard(this.claudeConfigSnippet)
  }

  public init(): void {}

  public dispose(): void {}
}

container.register(
  McpPageViewModel,
  () => {
    const context = container.get(ProjectContext)
    return new McpPageViewModel(context)
  },
  { scope: 'request' },
)
