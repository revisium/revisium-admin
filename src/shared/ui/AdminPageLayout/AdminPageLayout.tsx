import { Box, Flex } from '@chakra-ui/react'
import { Breadcrumb } from '@chakra-ui/react/breadcrumb'
import { FC, Fragment, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ADMIN_ROUTE } from 'src/shared/config/routes'

export interface BreadcrumbItem {
  label: string
  to?: string
}

interface AdminPageLayoutProps {
  breadcrumbs: BreadcrumbItem[]
  headerRight?: ReactNode
  children: ReactNode
}

export const AdminPageLayout: FC<AdminPageLayoutProps> = ({ breadcrumbs, headerRight, children }) => {
  return (
    <Flex flexDirection="column" height="100%">
      <Flex
        alignItems="center"
        backgroundColor="white"
        justifyContent="space-between"
        width="100%"
        position="sticky"
        zIndex={1}
        top={0}
        padding="8px"
      >
        <Flex alignItems="center" gap="4px" height="40px">
          <Breadcrumb.Root color="gray" fontWeight="600" fontSize="16px">
            <Breadcrumb.List fontSize="16px">
              <Breadcrumb.Item>
                <Breadcrumb.Link asChild color="gray">
                  <Link to={`/${ADMIN_ROUTE}`}>Admin</Link>
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              {breadcrumbs.map((item, index) => (
                <Fragment key={index}>
                  <Breadcrumb.Separator>/</Breadcrumb.Separator>
                  <Breadcrumb.Item>
                    {item.to ? (
                      <Breadcrumb.Link asChild color="gray">
                        <Link to={item.to}>{item.label}</Link>
                      </Breadcrumb.Link>
                    ) : (
                      <Breadcrumb.CurrentLink color="gray">{item.label}</Breadcrumb.CurrentLink>
                    )}
                  </Breadcrumb.Item>
                </Fragment>
              ))}
            </Breadcrumb.List>
          </Breadcrumb.Root>
        </Flex>
        {headerRight}
      </Flex>
      <Box flex={1}>{children}</Box>
    </Flex>
  )
}
