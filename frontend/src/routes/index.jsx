import { createFileRoute } from '@tanstack/react-router'
import ProductDisplay from '../components/ProductDisplay/ProductDisplay.jsx'
import NavigationBar from '../components/NavigationBar/NavigationBar.jsx'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <>
    <NavigationBar/>
    <div className="p-2">
      <ProductDisplay/>
    </div>
    </>
  )
}