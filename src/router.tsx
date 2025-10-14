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
import ProjectsLayout from './routes/projects/ProjectsLayout'
import ProjectsListPage from './routes/projects/ProjectsListPage'
import CreateProjectPage from './routes/projects/CreateProjectPage'
import ProjectDetailPage from './routes/projects/ProjectDetailPage'
import EditProjectPage from './routes/projects/EditProjectPage'
import NotesLayout from './routes/notes/NotesLayout'
import NotesListPage from './routes/notes/NotesListPage'
import CreateNotePage from './routes/notes/CreateNotePage'
import NoteDetailPage from './routes/notes/NoteDetailPage'
import EditNotePage from './routes/notes/EditNotePage'
import TagsLayout from './routes/tags/TagsLayout'
import TagsListPage from './routes/tags/TagsListPage'
import CreateTagPage from './routes/tags/CreateTagPage'
import TagDetailPage from './routes/tags/TagDetailPage'
import EditTagPage from './routes/tags/EditTagPage'

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
            path: 'projects',
            element: <ProjectsLayout />,
            children: [
              {
                index: true,
                element: <ProjectsListPage />,
              },
              {
                path: 'new',
                element: <CreateProjectPage />,
              },
              {
                path: ':projectId',
                element: <ProjectDetailPage />,
              },
              {
                path: ':projectId/edit',
                element: <EditProjectPage />,
              },
            ],
          },
          {
            path: 'notes',
            element: <NotesLayout />,
            children: [
              {
                index: true,
                element: <NotesListPage />,
              },
              {
                path: 'new',
                element: <CreateNotePage />,
              },
              {
                path: ':noteId',
                element: <NoteDetailPage />,
              },
              {
                path: ':noteId/edit',
                element: <EditNotePage />,
              },
            ],
          },
          {
            path: 'tags',
            element: <TagsLayout />,
            children: [
              {
                index: true,
                element: <TagsListPage />,
              },
              {
                path: 'new',
                element: <CreateTagPage />,
              },
              {
                path: ':tagId',
                element: <TagDetailPage />,
              },
              {
                path: ':tagId/edit',
                element: <EditTagPage />,
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
