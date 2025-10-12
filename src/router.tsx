import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import HomePage from './routes/HomePage'
import AboutPage from './routes/AboutPage'
import NotFoundPage from './routes/NotFoundPage'

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
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
