import { Flex, Text } from '@chakra-ui/react'
import { Breadcrumb } from '@chakra-ui/react/breadcrumb'
import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
import { useBranchPageTitleWidgetModel } from 'src/widgets/BranchPageTitleWidget/hooks/useBranchPageTitleWidgetModel.ts'

import styles from './BranchPageTitleWidget.module.scss'

export const BranchPageTitleWidget = observer(() => {
  const store = useBranchPageTitleWidgetModel()

  return (
    <Flex alignItems="center" gap="4px" flex={1} height="40px" className={styles.Root}>
      <Breadcrumb.Root color="gray" fontWeight="600" fontSize="16px">
        {store.breadcrumbs.map((breadcrumb) => (
          <Breadcrumb.Item key={breadcrumb.href}>
            {breadcrumb.isCurrentPage ? (
              <Breadcrumb.CurrentLink data-testid={breadcrumb.dataTestId}>
                {breadcrumb.title}
              </Breadcrumb.CurrentLink>
            ) : (
              <Breadcrumb.Link asChild>
                <Link to={breadcrumb.href} data-testid={breadcrumb.dataTestId}>
                  {breadcrumb.title}
                </Link>
              </Breadcrumb.Link>
            )}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb.Root>
      {store.title && (
        <Text color="gray" opacity="0.3" fontWeight="400" fontSize="16px">
          - {store.title}
        </Text>
      )}
    </Flex>
  )
})
