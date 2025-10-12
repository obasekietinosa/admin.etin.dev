import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import RequireAuth from './auth/RequireAuth'
import LoginPage from './routes/LoginPage'
import HomePage from './routes/HomePage'
import AboutPage from './routes/AboutPage'
import NotFoundPage from './routes/NotFoundPage'
import CompaniesLayout from './routes/companies/CompaniesLayout'
import CompaniesListPage from './routes/companies/CompaniesListPage'
import CreateCompanyPage from './routes/companies/CreateCompanyPage'
import CompanyDetailPage from './routes/companies/CompanyDetailPage'
import EditCompanyPage from './routes/companies/EditCompanyPage'
import RolesLayout from './routes/roles/RolesLayout'
import RolesListPage from './routes/roles/RolesListPage'
import CreateRolePage from './routes/roles/CreateRolePage'
import RoleDetailPage from './routes/roles/RoleDetailPage'
import EditRolePage from './routes/roles/EditRolePage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <RequireAuth />,
    children: [
      {
        element: <App />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: 'about',
            element: <AboutPage />,
          },
          {
            path: 'companies',
            element: <CompaniesLayout />,
            children: [
              {
                index: true,
                element: <CompaniesListPage />,
              },
              {
                path: 'new',
                element: <CreateCompanyPage />,
              },
              {
                path: ':companyId',
                element: <CompanyDetailPage />,
              },
              {
                path: ':companyId/edit',
                element: <EditCompanyPage />,
              },
            ],
          },
          {
            path: 'roles',
            element: <RolesLayout />,
            children: [
              {
                index: true,
                element: <RolesListPage />,
              },
              {
                path: 'new',
                element: <CreateRolePage />,
              },
              {
                path: ':roleId',
                element: <RoleDetailPage />,
              },
              {
                path: ':roleId/edit',
                element: <EditRolePage />,
              },
            ],
          },
          {
            path: '*',
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
])
