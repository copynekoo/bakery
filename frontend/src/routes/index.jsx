import { createFileRoute } from '@tanstack/react-router'
import ProductItem from '../components/ProductItem/ProductItem.jsx'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="p-2">
      <h3>Products</h3>
      <ProductItem/>
    </div>
  )
}