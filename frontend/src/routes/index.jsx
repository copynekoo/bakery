import { createFileRoute } from '@tanstack/react-router'
import ProductDisplay from '../components/ProductDisplay/ProductDisplay.jsx'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="p-2">
      <ProductDisplay/>
    </div>
  )
}