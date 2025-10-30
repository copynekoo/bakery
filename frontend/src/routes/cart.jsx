import { createFileRoute } from '@tanstack/react-router'
import NavigationBar from '../components/NavigationBar/NavigationBar.jsx'
import ShoppingCart from '../components/ShoppingCart/ShoppingCart.jsx'

export const Route = createFileRoute('/cart')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <NavigationBar/>  
      <ShoppingCart/>
    </>
  )
}
