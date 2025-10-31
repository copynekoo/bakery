import { Link } from '@tanstack/react-router'
import "./NavigationBar.css"

const NavigationBar = function() {
  return (
    <ul className="navBar">
      <li><Link to="/employees/products" className="[&.active]:font-bold">Products</Link></li>
      <li><Link to="/employees/orders" className="[&.active]:font-bold">Orders</Link></li>
    </ul>
  )
}

export default NavigationBar