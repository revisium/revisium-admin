import { LinkMaker } from 'src/entities/Navigation/model/LinkMaker.ts'
import { container } from 'src/shared/lib'

export const useLinkMaker = () => {
  return container.get(LinkMaker)
}
