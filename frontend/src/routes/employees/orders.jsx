import { createFileRoute } from '@tanstack/react-router'
import NavigationBar from "../../employees/components/NavigationBar/NavigationBar.jsx"
import OrdersDisplay from "../../employees/components/OrdersDisplay/OrdersDisplay.jsx"

export const Route = createFileRoute('/employees/orders')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
    <NavigationBar/>
    <OrdersDisplay/>
  </>}
