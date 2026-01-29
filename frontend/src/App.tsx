import './App.css'
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import AboutPage from './pages/AboutPage'
import HomePage from './pages/HomePage'

function RootLayout() {
  return (
    <div className="min-h-dvh">
      <div className="flex gap-4 p-4">
        <Link to="/" activeProps={{ className: 'font-semibold underline' }}>
          Home
        </Link>
        <Link
          to="/about"
          activeProps={{ className: 'font-semibold underline' }}
        >
          About
        </Link>
      </div>
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  )
}

const rootRoute = createRootRoute({
  component: RootLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'about',
  component: AboutPage,
})

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute])

const router = createRouter({
  routeTree,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      {import.meta.env.DEV ? (
        <TanStackDevtools
          plugins={[
            { name: 'TanStack Query', render: <ReactQueryDevtoolsPanel />, defaultOpen: true }
          ]}
        />
      ) : null}
    </>
  )
}
