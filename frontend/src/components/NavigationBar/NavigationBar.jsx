import { Link } from '@tanstack/react-router'
import "./NavigationBar.css"

const NavigationBar = function() {
  return (
    <ul className="navBar">
      <li><Link to="/" className="[&.active]:font-bold">Products</Link></li>
      <li><Link to="/orders" className="[&.active]:font-bold">Orders</Link></li>
      <li><Link to="/cart" className="[&.active]:font-bold">Shopping Cart</Link></li>
      <li><Link to="/profile" className="[&.active]:font-bold">Profile</Link></li>
    </ul>
  )
}

export default NavigationBar