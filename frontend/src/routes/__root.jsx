import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import '../assets/fonts/Roboto-Black.ttf'
import '../assets/fonts/Roboto-BlackItalic.ttf'
import '../assets/fonts/Roboto-Bold.ttf'
import '../assets/fonts/Roboto-BoldItalic.ttf'
import './__root.css'

const RootLayout = () => (
  <>
    <Outlet />
    <TanStackRouterDevtools />
  </>
)

export const Route = createRootRoute({ component: RootLayout })