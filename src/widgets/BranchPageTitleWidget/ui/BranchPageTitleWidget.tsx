import { Flex, Text } from '@chakra-ui/react'
import { Breadcrumb } from '@chakra-ui/react/breadcrumb'
import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { useBranchPageTitleWidgetModel } from 'src/widgets/BranchPageTitleWidget/hooks/useBranchPageTitleWidgetModel.ts'

import styles from './BranchPageTitleWidget.module.scss'

export const BranchPageTitleWidget = observer(() => {
  const store = useBranchPageTitleWidgetModel()

  return (
    <Flex alignItems="center" gap="4px" height="40px" className={styles.Root}>
      <Breadcrumb.Root color="gray" fontWeight="600" fontSize="16px">
        <Breadcrumb.List fontSize="16px">
          {store.breadcrumbs.map((breadcrumb, index) => (
            <Fragment key={breadcrumb.href}>
              <Breadcrumb.Item>
                {breadcrumb.isCurrentPage ? (
                  <Breadcrumb.CurrentLink color="gray" data-testid={breadcrumb.dataTestId}>
                    {breadcrumb.title}
                  </Breadcrumb.CurrentLink>
                ) : (
                  <Breadcrumb.Link asChild color="gray">
                    <Link to={breadcrumb.href} data-testid={breadcrumb.dataTestId}>
                      {breadcrumb.title}
                    </Link>
                  </Breadcrumb.Link>
                )}
              </Breadcrumb.Item>
              {index !== store.breadcrumbs.length - 1 && (
                <Breadcrumb.Separator>
                  <Text color="gray">/</Text>
                </Breadcrumb.Separator>
              )}
            </Fragment>
          ))}
        </Breadcrumb.List>
      </Breadcrumb.Root>
    </Flex>
  )
})
