import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import HomePage from './routes/HomePage'
import AboutPage from './routes/AboutPage'
import NotFoundPage from './routes/NotFoundPage'
import CompaniesLayout from './routes/companies/CompaniesLayout'
import CompaniesListPage from './routes/companies/CompaniesListPage'
import CreateCompanyPage from './routes/companies/CreateCompanyPage'
import CompanyDetailPage from './routes/companies/CompanyDetailPage'
import EditCompanyPage from './routes/companies/EditCompanyPage'

export const router = createBrowserRouter([
  {
    path: '/',
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
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
