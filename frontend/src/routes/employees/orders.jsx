import { createFileRoute } from '@tanstack/react-router'
import NavigationBar from "../../employees/components/NavigationBar/NavigationBar.jsx"
import OrdersTable from "../../employees/components/OrdersTable/OrdersTable.jsx"

export const Route = createFileRoute('/employees/orders')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
    <NavigationBar/>
    <OrdersTable/>
  </>}
