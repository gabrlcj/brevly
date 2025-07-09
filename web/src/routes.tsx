import App from './app'
import { createBrowserRouter } from 'react-router'
import { Redirect } from './components/redirect'
import { NotFound } from './components/not-found'

export const router = createBrowserRouter([
  { path: '/', Component: App },
  { path: ':shortUrl', Component: Redirect },
  { path: 'not-found', Component: NotFound },
  { path: '*', Component: NotFound },
])