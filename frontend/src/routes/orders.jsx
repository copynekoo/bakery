import { createFileRoute } from '@tanstack/react-router'
import OrdersTable from "../components/OrdersTable/OrdersTable.jsx"

export const Route = createFileRoute('/orders')({
  component: Orders,
})

function Orders() {
  return (
    <>
      <div className="p-2">Orders</div>
      <OrdersTable/>
    </>
  )
}