import { createFileRoute } from '@tanstack/react-router'
import RegisterPanel from '../components/RegisterPanel/RegisterPanel.jsx'
import NavigationBar from '../components/NavigationBar/NavigationBar.jsx'

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
    <NavigationBar/>
    <RegisterPanel/>
  </>
}
