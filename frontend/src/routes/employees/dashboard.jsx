import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/employees/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/employees/dashboard"!</div>
}
