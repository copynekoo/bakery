import { createFileRoute } from '@tanstack/react-router'
import LoginPanel from "../components/LoginPanel/LoginPanel.jsx"

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <LoginPanel/>
}
