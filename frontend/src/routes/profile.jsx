import { createFileRoute } from '@tanstack/react-router'
import ProfilePanel from '../components/ProfilePanel/ProfilePanel.jsx'
import NavigationBar from '../components/NavigationBar/NavigationBar.jsx'

export const Route = createFileRoute('/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
    <NavigationBar/>
    <ProfilePanel/>
  </>
}
