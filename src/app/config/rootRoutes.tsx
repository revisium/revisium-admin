import { Outlet, RouteObject } from 'react-router-dom'
import { branchLoader } from 'src/app/lib/branchLoader.ts'
import { checkAuth } from 'src/app/lib/checkAuth.ts'
import { checkGuest } from 'src/app/lib/checkGuest.ts'
import { checkSignUp } from 'src/app/lib/checkSignUp.ts'
import { composeLoaders } from 'src/app/lib/composeLoaders.ts'
import { mainPageLoader } from 'src/app/lib/mainPageLoader.ts'
import { organizationLoader } from 'src/app/lib/organizationLoader.ts'
import { projectLoader } from 'src/app/lib/projectLoader.ts'
import { revisionLoader } from 'src/app/lib/revisionLoaders/revisionLoader.ts'
import { rowLoader } from 'src/app/lib/rowLoaders/rowLoader.ts'
import { tableLoader } from 'src/app/lib/tableLoaders/tableLoader.ts'
import { ApolloSandboxPage } from 'src/pages/ApolloSandboxPage'
import { ProjectSettingsPage } from 'src/pages/ProjectSettingsPage'

import { BranchPage } from 'src/pages/BranchPage'
import { ConfirmEmailCodePage } from 'src/pages/ConfirmEmailCodePage/ui/ConfirmEmailCodePage/ConfirmEmailCodePage.tsx'
import { LoginGithubPage, checkLoginGithub } from 'src/pages/LoginGithubPage'
import { LoginPage } from 'src/pages/LoginPage'
import { LogoutPage } from 'src/pages/LogoutPage'
import { MainPage } from 'src/pages/MainPage'
import { MigrationsPage } from 'src/pages/MigrationsPage'
import { RevisionPage } from 'src/pages/RevisionPage'
import { RowPage } from 'src/pages/RowPage'
import { SignUpCompletedPage } from 'src/pages/SignUpCompletedPage'
import { checkLoginGoogle, LoginGooglePage } from 'src/pages/LoginGooglePage'
import { SignUpPage } from 'src/pages/SignUpPage'
import { TablePage } from 'src/pages/TablePage'
import { UsernamePage } from 'src/pages/UsernamePage'
import {
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
  MIGRATIONS_ROUTE,
} from 'src/shared/config/routes'
import { ErrorWidget } from 'src/widgets/ErrorWidget/ui/ErrorWidget/ErrorWidget.tsx'
import { RevisionPageErrorWidget } from 'src/widgets/RevisionPageErrorWidget/ui/RevisionPageErrorWidget/RevisionPageErrorWidget.tsx'

import { Layout } from '../ui/Layout'

const createRevisionRouteObjects = (): RouteObject[] => [
  {
    index: true,
    element: <RevisionPage />,
  },
  {
    path: MIGRATIONS_ROUTE,
    element: <MigrationsPage />,
    id: RouteIds.Migrations,
  },
]

const createTableRouteObject = (): RouteObject => ({
  path: TABLE_ROUTE,
  loader: tableLoader,
  id: RouteIds.Table,
  children: [
    {
      index: true,
      element: <TablePage />,
    },
    {
      path: ROW_ROUTE,
      loader: rowLoader,
      id: RouteIds.Row,
      element: <RowPage />,
    },
  ],
})

const organizationRouteObject = {
  path: ORGANIZATION_ROUTE,
  element: <Outlet />,
  loader: composeLoaders(checkAuth, organizationLoader),
  id: RouteIds.Organization,
  children: [
    {
      path: PROJECT_ROUTE,
      element: <Outlet />,
      loader: composeLoaders(checkAuth, projectLoader),
      id: RouteIds.Project,
      children: [
        {
          path: PROJECT_SETTINGS_ROUTE,
          element: <ProjectSettingsPage />,
          id: RouteIds.ProjectSettings,
        },
        {
          path: PROJECT_USERS_ROUTE,
          element: <div>Project Users Page</div>,
          id: RouteIds.ProjectUsers,
        },
        {
          path: PROJECT_API_KEYS_ROUTE,
          element: <div>Project API Keys Page</div>,
          id: RouteIds.ProjectApiKeys,
        },
        {
          path: BRANCH_ROUTE,
          element: <BranchPage />,
          loader: branchLoader,
          id: RouteIds.Branch,
          children: [
            {
              path: REVISION_ROUTE,
              loader: revisionLoader,
              id: RouteIds.Revision,
              errorElement: <RevisionPageErrorWidget />,
              children: [...createRevisionRouteObjects(), createTableRouteObject()],
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
    ],
  },
]
