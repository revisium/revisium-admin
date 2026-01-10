import { Outlet, RouteObject } from 'react-router-dom'
import { checkAdmin } from 'src/app/lib/checkAdmin.ts'
import { checkAuth } from 'src/app/lib/checkAuth.ts'
import { checkGuest } from 'src/app/lib/checkGuest.ts'
import { checkSignUp } from 'src/app/lib/checkSignUp.ts'
import { composeLoaders } from 'src/app/lib/composeLoaders.ts'
import { mainPageLoader } from 'src/app/lib/mainPageLoader.ts'
import { AdminDashboardPage } from 'src/pages/AdminDashboardPage'
import { AdminLayout } from 'src/pages/AdminLayout'
import { AdminOrganizationsPage } from 'src/pages/AdminOrganizationsPage'
import { AdminUserDetailPage } from 'src/pages/AdminUserDetailPage'
import { AdminUsersPage } from 'src/pages/AdminUsersPage'
import { ApolloSandboxPage } from 'src/pages/ApolloSandboxPage'
import { ChangesPage, ChangesLayout } from 'src/pages/ChangesPage'
import { AllRowsChangesPage } from 'src/pages/AllRowsChangesPage'
import { BranchesPage } from 'src/pages/BranchesPage'
import { EndpointsPage } from 'src/pages/EndpointsPage'
import { McpPage } from 'src/pages/McpPage'
import { McpTokenPage } from 'src/pages/McpTokenPage'
import { ProjectLayout } from 'src/pages/ProjectLayout'
import { ProjectSettingsPage } from 'src/pages/ProjectSettingsPage'
import { UsersPage } from 'src/pages/UsersPage'

import { BranchPage } from 'src/pages/BranchPage'
import { DatabaseLayout } from 'src/pages/DatabaseLayout'
import { ConfirmEmailCodePage } from 'src/pages/ConfirmEmailCodePage/ui/ConfirmEmailCodePage/ConfirmEmailCodePage.tsx'
import { LoginGithubPage, checkLoginGithub } from 'src/pages/LoginGithubPage'
import { LoginPage } from 'src/pages/LoginPage'
import { LogoutPage } from 'src/pages/LogoutPage'
import { MainPage } from 'src/pages/MainPage'
import { MigrationsPage } from 'src/pages/MigrationsPage'
import { TableRelationsPage } from 'src/pages/TableRelationsPage'
import { RevisionPage } from 'src/pages/RevisionPage'
import { RowPage } from 'src/pages/RowPage'
import { SignUpCompletedPage } from 'src/pages/SignUpCompletedPage'
import { checkLoginGoogle, LoginGooglePage } from 'src/pages/LoginGooglePage'
import { SignUpPage } from 'src/pages/SignUpPage'
import { TablePage } from 'src/pages/TablePage'
import { UsernamePage } from 'src/pages/UsernamePage'
import {
  ADMIN_ORGANIZATIONS_ROUTE,
  ADMIN_ROUTE,
  ADMIN_USER_DETAIL_ROUTE,
  ADMIN_USERS_ROUTE,
  BRANCH_ROUTE,
  SIGN_UP_CONFIRM_ROUTE,
  LOGIN_ROUTE,
  LOGOUT_ROUTE,
  ORGANIZATION_ROUTE,
  PROJECT_ROUTE,
  REVISION_ROUTE,
  RouteIds,
  ROW_ROUTE,
  SIGN_UP_ROUTE,
  SIGN_UP_COMPLETED_ROUTE,
  TABLE_ROUTE,
  LOGIN_GOOGLE_ROUTE,
  LOGIN_GITHUB_ROUTE,
  USERNAME_ROUTE,
  APP_ROUTE,
  SANDBOX_ROUTE,
  PROJECT_SETTINGS_ROUTE,
  PROJECT_USERS_ROUTE,
  PROJECT_API_KEYS_ROUTE,
  PROJECT_MCP_ROUTE,
  CHANGES_ROUTE,
  MIGRATIONS_ROUTE,
  ENDPOINTS_ROUTE,
  BRANCHES_ROUTE,
  RELATIONS_ROUTE,
  MCP_TOKEN_ROUTE,
} from 'src/shared/config/routes'
import { ErrorWidget } from 'src/widgets/ErrorWidget/ui/ErrorWidget/ErrorWidget.tsx'
import { RevisionPageErrorWidget } from 'src/widgets/RevisionPageErrorWidget/ui/RevisionPageErrorWidget/RevisionPageErrorWidget.tsx'

import { Layout } from '../ui/Layout'

const createRevisionRouteObjects = (): RouteObject[] => [
  {
    index: true,
    element: <RevisionPage />,
  },
]

const createChangesRouteObject = (): RouteObject => ({
  path: CHANGES_ROUTE,
  id: RouteIds.Changes,
  element: <ChangesLayout />,
  children: [
    {
      index: true,
      element: <ChangesPage />,
    },
    {
      path: 'rows',
      element: <AllRowsChangesPage />,
    },
  ],
})

const createMigrationsRouteObject = (): RouteObject => ({
  path: MIGRATIONS_ROUTE,
  element: <MigrationsPage />,
  id: RouteIds.Migrations,
})

const createRelationsRouteObject = (): RouteObject => ({
  path: RELATIONS_ROUTE,
  element: <TableRelationsPage />,
  id: RouteIds.Relations,
})

const createTableRouteObject = (): RouteObject => ({
  path: TABLE_ROUTE,
  id: RouteIds.Table,
  children: [
    {
      index: true,
      element: <TablePage />,
    },
    {
      path: ROW_ROUTE,
      id: RouteIds.Row,
      element: <RowPage />,
    },
  ],
})

const organizationRouteObject = {
  path: ORGANIZATION_ROUTE,
  element: <Outlet />,
  loader: checkAuth,
  id: RouteIds.Organization,
  children: [
    {
      path: PROJECT_ROUTE,
      element: <ProjectLayout />,
      loader: checkAuth,
      id: RouteIds.Project,
      children: [
        {
          path: PROJECT_SETTINGS_ROUTE,
          element: <ProjectSettingsPage />,
          id: RouteIds.ProjectSettings,
        },
        {
          path: ENDPOINTS_ROUTE,
          element: <EndpointsPage />,
          id: RouteIds.Endpoints,
        },
        {
          path: BRANCHES_ROUTE,
          element: <BranchesPage />,
          id: RouteIds.Branches,
        },
        {
          path: PROJECT_MCP_ROUTE,
          element: <McpPage />,
          id: RouteIds.ProjectMcp,
        },
        {
          path: PROJECT_USERS_ROUTE,
          element: <UsersPage />,
          id: RouteIds.ProjectUsers,
        },
        {
          path: PROJECT_API_KEYS_ROUTE,
          element: <div>Project API Keys Page</div>,
          id: RouteIds.ProjectApiKeys,
        },
        {
          path: BRANCH_ROUTE,
          id: RouteIds.Branch,
          children: [
            {
              path: REVISION_ROUTE,
              id: RouteIds.Revision,
              errorElement: <RevisionPageErrorWidget />,
              children: [
                {
                  element: <DatabaseLayout />,
                  children: [...createRevisionRouteObjects(), createTableRouteObject()],
                },
                {
                  element: <BranchPage showTitle={false} />,
                  children: [createChangesRouteObject(), createMigrationsRouteObject(), createRelationsRouteObject()],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export const ROOT_ROUTES: RouteObject[] = [
  {
    path: `${SANDBOX_ROUTE}/*`,
    element: <ApolloSandboxPage />,
  },
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorWidget />,
    children: [
      {
        index: true,
        element: <MainPage />,
        loader: composeLoaders(checkAuth, mainPageLoader),
      },
      {
        path: USERNAME_ROUTE,
        element: <UsernamePage />,
      },
      {
        path: MCP_TOKEN_ROUTE,
        element: <McpTokenPage />,
        loader: checkAuth,
      },
      {
        path: LOGIN_ROUTE,
        loader: checkGuest,
        children: [
          {
            index: true,
            element: <LoginPage />,
          },
          {
            path: LOGIN_GOOGLE_ROUTE,
            loader: checkLoginGoogle,
            element: <LoginGooglePage />,
          },
          {
            path: LOGIN_GITHUB_ROUTE,
            loader: checkLoginGithub,
            element: <LoginGithubPage />,
          },
        ],
      },
      {
        path: LOGOUT_ROUTE,
        element: <LogoutPage />,
        loader: checkAuth,
      },
      {
        path: SIGN_UP_ROUTE,
        loader: checkSignUp,
        children: [
          {
            index: true,
            element: <SignUpPage />,
          },
          {
            path: SIGN_UP_COMPLETED_ROUTE,
            element: <SignUpCompletedPage />,
          },
          {
            path: SIGN_UP_CONFIRM_ROUTE,
            element: <ConfirmEmailCodePage />,
          },
        ],
      },
      {
        path: APP_ROUTE,
        children: [organizationRouteObject],
      },
      {
        path: ADMIN_ROUTE,
        element: <AdminLayout />,
        loader: composeLoaders(checkAuth, checkAdmin),
        id: RouteIds.Admin,
        children: [
          {
            index: true,
            element: <AdminDashboardPage />,
          },
          {
            path: ADMIN_USERS_ROUTE,
            id: RouteIds.AdminUsers,
            children: [
              {
                index: true,
                element: <AdminUsersPage />,
              },
              {
                path: ADMIN_USER_DETAIL_ROUTE,
                element: <AdminUserDetailPage />,
                id: RouteIds.AdminUserDetail,
              },
            ],
          },
          {
            path: ADMIN_ORGANIZATIONS_ROUTE,
            element: <AdminOrganizationsPage />,
            id: RouteIds.AdminOrganizations,
          },
        ],
      },
    ],
  },
]
