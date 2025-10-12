import { observer } from 'mobx-react-lite'
import React from 'react'

import { BranchMenuList } from 'src/widgets/BranchMenuList'

export const SidebarWidget: React.FC = observer(() => {
  return <BranchMenuList />
})
