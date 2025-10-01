import './ProductItemStatusBar.css'
import { useState } from "react";
import { createPortal } from 'react-dom';
import PurchasePopUp from '../PurchasePopUp/PurchasePopUp.jsx'

const ProductItemStatusBar = function({remainingItem, p_price, p_id, p_name}) {
  const [showPurchaseModal, setPurchaseModal] = useState(false);
  const [quantity, setQuantity] = useState("1");

  const onClickPurchase = function() {
    setPurchaseModal(true);
  }

  const onClosePurchase = function() {
    setPurchaseModal(false);
  }

  const PreOrderButton = function() {
    return <div className="preOrder"><button>Pre Order</button></div>;
  }

  const PurchaseButton = function() {
    return <div className="purchase"><button onClick={onClickPurchase}>Purchase</button></div>
  }
  return (
    <>
      <div className="productBar">
        <div className="productBar-left">{remainingItem} In Stock</div>
        <div className="productBar-right"><input type="number" id="quantity" value={quantity} onChange={e => setQuantity(e.target.value)} name="quantity" min="1" max={remainingItem}/>Add to Cart</div>
      </div>
      {remainingItem > 0 ? PurchaseButton() : PreOrderButton()}
      {showPurchaseModal && createPortal(
      <PurchasePopUp remainingItem={remainingItem} id={p_id} name={p_name} price={p_price} onClose={onClosePurchase} />,
      document.body
      )}
    </>
  )
}

export default ProductItemStatusBar