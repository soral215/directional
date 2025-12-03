import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Layout, PrivateRoute } from './components'
import { LoginPage, PostsPage, ChartsPage } from './pages'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: '/posts',
            element: <PostsPage />,
          },
          {
            path: '/charts',
            element: <ChartsPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/posts" replace />,
  },
])

