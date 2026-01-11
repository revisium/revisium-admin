import { container } from 'src/shared/lib'
import { FullscreenService as BaseFullscreenService } from 'src/shared/lib/FullscreenService'

export class FullscreenService extends BaseFullscreenService {}

container.register(FullscreenService, () => new FullscreenService(), { scope: 'request' })
