import { createFileRoute } from '@tanstack/react-router'
import OrdersTable from "../components/OrdersTable/OrdersTable.jsx"
import NavigationBar from '../components/NavigationBar/NavigationBar.jsx'

export const Route = createFileRoute('/orders')({
  component: Orders,
})

function Orders() {
  return (
    <>
      <NavigationBar/>
      <div className="p-2">Orders</div>
      <OrdersTable/>
    </>
  )
}