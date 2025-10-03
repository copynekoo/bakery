import { createFileRoute } from '@tanstack/react-router'
import LoginPanel from "../../employees/components/LoginPanel/LoginPanel.jsx"

export const Route = createFileRoute('/employees/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <LoginPanel/>
}
