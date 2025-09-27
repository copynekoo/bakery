import { createFileRoute } from '@tanstack/react-router'
import ProfilePanel from '../components/ProfilePanel/ProfilePanel.jsx'

export const Route = createFileRoute('/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ProfilePanel/>
}
