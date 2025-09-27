import './ProductItemStatusBar.css'

const PreOrderButton = function() {
  return <div className="preOrder"><button>Pre Order</button></div>;
}

const PurchaseButton = function() {
  return <div className="buyNow"><button>Purchase</button></div>
}

const ProductItemStatusBar = function({remainingItem}) {
  return (
    <>
      <div className="productBar">
        <div className="productBar-left">{remainingItem} In Stock</div>
        <div className="productBar-right"><input type="number" id="quantity" name="quantity" min="1" max={remainingItem}/>Add to Cart</div>
      </div>
      {remainingItem > 0 ? PurchaseButton() : PreOrderButton()}
    </>
  )
}

export default ProductItemStatusBar