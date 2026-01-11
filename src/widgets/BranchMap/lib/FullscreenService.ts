import { container } from 'src/shared/lib'
import { FullscreenService } from 'src/shared/lib/FullscreenService'

export class BranchMapFullscreenService extends FullscreenService {}

container.register(BranchMapFullscreenService, () => new BranchMapFullscreenService(), { scope: 'request' })
