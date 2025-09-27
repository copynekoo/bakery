import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import NavigationBar from '../components/NavigationBar/NavigationBar.jsx'
import '../assets/fonts/Roboto-Black.ttf'
import '../assets/fonts/Roboto-BlackItalic.ttf'
import '../assets/fonts/Roboto-Bold.ttf'
import '../assets/fonts/Roboto-BoldItalic.ttf'
import './__root.css'

const RootLayout = () => (
  <>
    <NavigationBar/>
    <Outlet />
    <TanStackRouterDevtools />
  </>
)

export const Route = createRootRoute({ component: RootLayout })