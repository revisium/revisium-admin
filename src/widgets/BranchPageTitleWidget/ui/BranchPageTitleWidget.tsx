import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
import { useBranchPageTitleWidgetModel } from 'src/widgets/BranchPageTitleWidget/hooks/useBranchPageTitleWidgetModel.ts'

import styles from './BranchPageTitleWidget.module.scss'

export const BranchPageTitleWidget = observer(() => {
  const store = useBranchPageTitleWidgetModel()

  return (
    <Flex alignItems="center" gap="4px" flex={1} height="40px" className={styles.Root}>
      <Breadcrumb spacing="8px" separator={'/'} color="gray" fontWeight="600" fontSize="16px">
        {store.breadcrumbs.map((breadcrumb) => (
          <BreadcrumbItem key={breadcrumb.href} isCurrentPage={breadcrumb.isCurrentPage}>
            <BreadcrumbLink
              data-testid={breadcrumb.dataTestId}
              to={breadcrumb.href}
              as={breadcrumb.isCurrentPage ? undefined : Link}
            >
              {breadcrumb.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
      {store.title && (
        <Text color="gray" opacity="0.3" fontWeight="400" fontSize="16px">
          - {store.title}
        </Text>
      )}
    </Flex>
  )
})
