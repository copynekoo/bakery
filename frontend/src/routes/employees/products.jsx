import { createFileRoute } from '@tanstack/react-router'
import NavigationBar from "../../employees/components/NavigationBar/NavigationBar.jsx"

export const Route = createFileRoute('/employees/products')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
    <NavigationBar/>
  </>
}