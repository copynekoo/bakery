import { createFileRoute } from '@tanstack/react-router'
import OrdersDisplay from "../components/OrdersDisplay/OrdersDisplay.jsx"
import NavigationBar from '../components/NavigationBar/NavigationBar.jsx'

export const Route = createFileRoute('/orders')({
  component: Orders,
})

function Orders() {
  return (
    <>
      <NavigationBar/>
      <OrdersDisplay/>
    </>
  )
}