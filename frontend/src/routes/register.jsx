import { createFileRoute } from '@tanstack/react-router'
import RegisterPanel from '../components/RegisterPanel/RegisterPanel.jsx'

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return <RegisterPanel/>
}
