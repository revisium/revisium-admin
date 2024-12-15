import { LoaderFunction, Outlet, RouteObject } from 'react-router-dom'
import { branchLoader } from 'src/app/lib/branchLoader.ts'
import { checkAuth } from 'src/app/lib/checkAuth.ts'
import { checkGuest } from 'src/app/lib/checkGuest.ts'
import { checkSignUp } from 'src/app/lib/checkSignUp.ts'
import { composeLoaders } from 'src/app/lib/composeLoaders.ts'
import { mainPageLoader } from 'src/app/lib/mainPageLoader.ts'
import { organizationLoader } from 'src/app/lib/organizationLoader.ts'
import { projectLoader } from 'src/app/lib/projectLoader.ts'
import { draftRevisionLoader } from 'src/app/lib/revisionLoaders/draftRevisionLoader.ts'
import { headRevisionLoader } from 'src/app/lib/revisionLoaders/headRevisionLoader.ts'
import { specificRevisionLoader } from 'src/app/lib/revisionLoaders/specificRevisionLoader.ts'
import { draftRowLoader } from 'src/app/lib/rowLoaders/draftRowLoader.ts'
import { headRowLoader } from 'src/app/lib/rowLoaders/headRowLoader.ts'
import { specificRowLoader } from 'src/app/lib/rowLoaders/specificRowLoader.ts'
import { draftTableLoader } from 'src/app/lib/tableLoaders/draftTableLoader.ts'
import { headTableLoader } from 'src/app/lib/tableLoaders/headTableLoader.ts'
import { specificTableLoader } from 'src/app/lib/tableLoaders/specificTableLoader.ts'

import { BranchPage } from 'src/pages/BranchPage'
import { ConfirmEmailCodePage } from 'src/pages/ConfirmEmailCodePage/ui/ConfirmEmailCodePage/ConfirmEmailCodePage.tsx'
import { LoginGithubPage, checkLoginGithub } from 'src/pages/LoginGithubPage'
import { LoginPage } from 'src/pages/LoginPage'
import { LogoutPage } from 'src/pages/LogoutPage'
import { MainPage } from 'src/pages/MainPage'
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
  DRAFT_REVISION_ROUTE,
  LOGIN_ROUTE,
  LOGOUT_ROUTE,
  ORGANIZATION_ROUTE,
  PROJECT_ROUTE,
  RouteIds,
  ROW_ROUTE,
  SIGN_UP_ROUTE,
  SIGN_UP_COMPLETED_ROUTE,
  SPECIFIC_REVISION_ROUTE,
  TABLE_ROUTE,
  LOGIN_GOOGLE_ROUTE,
  LOGIN_GITHUB_ROUTE,
  USERNAME_ROUTE,
} from 'src/shared/config/routes'
import { ErrorWidget } from 'src/widgets/ErrorWidget/ui/ErrorWidget/ErrorWidget.tsx'
import { RevisionPageErrorWidget } from 'src/widgets/RevisionPageErrorWidget/ui/RevisionPageErrorWidget/RevisionPageErrorWidget.tsx'

import { Layout } from '../ui/Layout'

const createTableRouteObject = ({
  tableLoader,
  tableId,
  rowLoader,
  rowId,
}: {
  tableLoader: LoaderFunction
  tableId: RouteIds
  rowLoader: LoaderFunction
  rowId: RouteIds
}): RouteObject => ({
  path: TABLE_ROUTE,
  loader: tableLoader,
  id: tableId,
  children: [
    {
      index: true,
      element: <TablePage />,
    },
    {
      path: ROW_ROUTE,
      loader: rowLoader,
      id: rowId,
      element: <RowPage />,
    },
  ],
})

export const ROOT_ROUTES: RouteObject[] = [
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
                path: BRANCH_ROUTE,
                element: <BranchPage />,
                loader: branchLoader,
                id: RouteIds.Branch,
                children: [
                  {
                    loader: headRevisionLoader,
                    id: RouteIds.HeadRevision,
                    errorElement: <RevisionPageErrorWidget />,
                    children: [
                      {
                        index: true,
                        element: <RevisionPage />,
                      },
                      createTableRouteObject({
                        tableLoader: headTableLoader,
                        tableId: RouteIds.HeadTable,
                        rowLoader: headRowLoader,
                        rowId: RouteIds.HeadRow,
                      }),
                    ],
                  },
                  {
                    path: DRAFT_REVISION_ROUTE,
                    loader: draftRevisionLoader,
                    id: RouteIds.DraftRevision,
                    errorElement: <RevisionPageErrorWidget />,
                    children: [
                      {
                        index: true,
                        element: <RevisionPage />,
                      },
                      createTableRouteObject({
                        tableLoader: draftTableLoader,
                        tableId: RouteIds.DraftTable,
                        rowLoader: draftRowLoader,
                        rowId: RouteIds.DraftRow,
                      }),
                    ],
                  },
                  {
                    path: SPECIFIC_REVISION_ROUTE,
                    loader: specificRevisionLoader,
                    id: RouteIds.SpecificRevision,
                    errorElement: <RevisionPageErrorWidget />,
                    children: [
                      {
                        index: true,
                        element: <RevisionPage />,
                      },
                      createTableRouteObject({
                        tableLoader: specificTableLoader,
                        tableId: RouteIds.SpecificTable,
                        rowLoader: specificRowLoader,
                        rowId: RouteIds.SpecificRow,
                      }),
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]
