import './ProductItemStatusBar.css'
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { createPortal } from 'react-dom';
import axios from "axios";
import PurchasePopUp from '../PurchasePopUp/PurchasePopUp.jsx'
import PreOrderPopUp from '../PreOrderPopUp/PreOrderPopUp.jsx'

const ProductItemStatusBar = function({remainingItem, p_price, p_id, p_name}) {
  const [showPurchaseModal, setPurchaseModal] = useState(false);
  const [showPreOrderModal, setPreOrderModal] = useState(false);
  const [quantity, setQuantity] = useState("1");
  const [addToCartMessage, setAddToCartMessage] = useState(null);
  const navigate = useNavigate();

  const onClickPurchase = function() {
    setPurchaseModal(true);
  }

  const onClosePurchase = function() {
    setPurchaseModal(false);
  }

  const onClickPreOrder = function() {
    setPreOrderModal(true);
  }

  const onClosePreOrder = function() {
    setPreOrderModal(false);
  }

  const PreOrderButton = function() {
    return <div className="preOrder"><button onClick={onClickPreOrder}>Pre Order</button></div>;
  }

  const validateQuantity = (value) => {
    const parsedValue = Number(value);
    if (!Number.isFinite(parsedValue) || parsedValue < 1) {
      return 1;
    }
    const maxAvailable = Number(remainingItem);
    if (Number.isFinite(maxAvailable) && maxAvailable > 0 && parsedValue > maxAvailable) {
      return maxAvailable;
    }
    return Math.floor(parsedValue);
  }

  const onChangeQuantity = (event) => {
    const nextValue = event.target.value;
    setQuantity(nextValue);
  }

  const onBlurQuantity = () => {
    const normalized = validateQuantity(quantity);
    setQuantity(String(normalized));
  }

  const handleAddToCart = async () => {
    setAddToCartMessage(null);
    const validatedQuantity = validateQuantity(quantity);
    setQuantity(String(validatedQuantity));

    const numericStock = Number(remainingItem ?? 0);
    const isStockKnown = Number.isFinite(numericStock) && numericStock >= 0;
    const shouldPreOrder = !isStockKnown || numericStock === 0 || validatedQuantity > numericStock;
    const orderMethod = shouldPreOrder ? "Pre Order" : "Buy Now";

    try {
      await axios.post(
        import.meta.env.VITE_API_DOMAIN + "/api/cart",
        {
          product_id: p_id,
          quantity: validatedQuantity,
          order_method: orderMethod,
        },
        { withCredentials: true }
      );
      setAddToCartMessage({
        type: shouldPreOrder ? "info" : "success",
        text: shouldPreOrder
          ? `${validatedQuantity} item(s) added to cart as Pre Order.`
          : `${validatedQuantity} item(s) added to cart.`,
      });
    } catch (error) {
      if (error?.response?.status === 401) {
        navigate({ to: "/login" });
        return;
      }
      const message = error?.response?.data?.message || "Unable to add to cart.";
      setAddToCartMessage({ type: "error", text: message });
    }
  }

  const PurchaseButton = function() {
    return <div className="purchase"><button onClick={onClickPurchase}>Purchase</button></div>
  }
  return (
    <>
      <div className="productBar">
        <div className="productBar-right">
          <input type="number" id="quantity" value={quantity} onChange={onChangeQuantity} onBlur={onBlurQuantity} name="quantity" min="1" max={remainingItem}/>
          <button className="addToCartButton" onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div>
      {addToCartMessage && (
        <div className={`productBar-feedback ${addToCartMessage.type}`}>
          {addToCartMessage.text}
        </div>
      )}
      {remainingItem > 0 ? PurchaseButton() : PreOrderButton()}
      {showPurchaseModal && createPortal(
      <PurchasePopUp remainingItem={remainingItem} id={p_id} name={p_name} price={p_price} onClose={onClosePurchase} />,
      document.body
      )}
      {showPreOrderModal && createPortal(
      <PreOrderPopUp remainingItem={remainingItem} id={p_id} name={p_name} price={p_price} onClose={onClosePreOrder} />,
      document.body
      )}
    </>
  )
}

export default ProductItemStatusBar
