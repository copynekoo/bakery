import { createFileRoute } from '@tanstack/react-router'
import LoginPanel from "../components/LoginPanel/LoginPanel.jsx"
import NavigationBar from '../components/NavigationBar/NavigationBar.jsx'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
    <NavigationBar/>
    <LoginPanel/>
  </>
}
