import { observer } from 'mobx-react-lite'
import React from 'react'

import { useRevisionPageModel } from 'src/pages/RevisionPage/hooks/useRevisionPageModel.ts'
import { TableStackModelContext } from 'src/pages/RevisionPage/model/TableStackModelContext.ts'
import { TableStack } from 'src/pages/RevisionPage/ui/TableStack/TableStack.tsx'

export const RevisionPage: React.FC = observer(() => {
  const store = useRevisionPageModel()

  return (
    <>
      {store.stack.map((item) => (
        <TableStackModelContext.Provider
          key={item.id}
          value={{
            root: store,
            item,
          }}
        >
          <TableStack />
        </TableStackModelContext.Provider>
      ))}
    </>
  )
})
