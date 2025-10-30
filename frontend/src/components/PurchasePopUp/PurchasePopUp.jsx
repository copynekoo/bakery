import "./PurchasePopUp.css"
import { useState, useEffect } from "react"
import axios from "axios"

const PurchasePopUp = function({id, name, price, remainingItem, onClose}) {
  const [purchaseOption, setPurchaseOption] = useState("Buy Now");
  const [preOrderQuantity, setPreOrderQuantity] = useState(1);
  const [buyNowQuantity, setBuyNowQuantity] = useState(1);
  const [defaultShippingDestination, setDefaultShippingDestination] = useState("");
  const [customShippingDestination, setCustomShippingDestination] = useState("");
  const [useDefaultShippingDestination, setUseDefaultShippingDestination] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  useEffect(() => {
    const fetchDefaultShipping = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_DOMAIN + "/api/profile/defaultshippingdst",
          { withCredentials: true }
        );
        setDefaultShippingDestination(response.data?.[0]?.defaultshippingdst || "");
      } catch (error) {
        console.log(error);
      }
    };

    fetchDefaultShipping();
  }, []);

  const shippingDestinationValue = useDefaultShippingDestination
    ? defaultShippingDestination
    : customShippingDestination;

  const purchase = async function(p_id, method, quantity) {
    setFeedbackMessage(null);
    if (!shippingDestinationValue?.trim()) {
      setFeedbackMessage("Shipping destination is required.");
      return;
    }

    try {
      await axios({
        method: "post",
        url: import.meta.env.VITE_API_DOMAIN + '/' + 'api' + '/' + 'orders' + '/' + 'purchase',
        withCredentials: true,
        data: [{
          product_id: p_id,
          order_method: method,
          quantity: quantity,
          shippingdestination: shippingDestinationValue,
        }],
      });
      setFeedbackMessage("Order submitted successfully.");
    } catch (error) {
      console.log(error);
      setFeedbackMessage("Unable to submit order. Please try again.");
    }
  }

  const renderShippingDestination = () => (
    <textarea
      id="shippingDstPreview"
      name="shippingDstPreview"
      rows="4"
      cols="30"
      value={useDefaultShippingDestination ? defaultShippingDestination : customShippingDestination}
      disabled={useDefaultShippingDestination}
      onChange={(event) => setCustomShippingDestination(event.target.value)}
    />
  );

  const renderBuyNowOption = function(isOpen) {
    if (!isOpen) return null;

    return (
      <div className="buyNowOption">
        <div>Buy Now</div>
        <div>Buying {buyNowQuantity} {name} for each {price}</div>
        <div>Total Price {buyNowQuantity*price} Baht </div>
        <div className="buyNowMenu">Quantity <input type="number" id="quantity" value={buyNowQuantity} onChange={e => setBuyNowQuantity(Number(e.target.value))} name="quantity" min="1" max={remainingItem}/></div>
        <input type="checkbox" id="useShippingDst" name="useShippingDst" value="useShippingDst" checked={useDefaultShippingDestination} onChange={() => setUseDefaultShippingDestination(prev => !prev)}/>
        <label htmlFor="useShippingDst">Use default shipping destination</label><br/><br/>
        {renderShippingDestination()}
        <button onClick={() => purchase(id, "Buy Now", buyNowQuantity)}>Buy Now</button><br/>
      </div>
    )
  }

  const renderPreOrderOption = function(isOpen) {
    if (!isOpen) return null;

    return (
      <div className="preOrderOption">
        <div>Pre Order</div>
        <div>Buying {preOrderQuantity} {name} for each {price}</div>
        <div>Total Price {preOrderQuantity*price} Baht </div>
        <div className="preOrderMenu">Quantity <input type="number" id="quantity" value={preOrderQuantity} onChange={e => setPreOrderQuantity(Number(e.target.value))} name="quantity" min="1" max="100"/></div>
        <input type="checkbox" id="useShippingDstPreOrder" name="useShippingDstPreOrder" value="useShippingDstPreOrder" checked={useDefaultShippingDestination} onChange={() => setUseDefaultShippingDestination(prev => !prev)}/>
        <label htmlFor="useShippingDstPreOrder">Use default shipping destination</label><br/><br/>
        {renderShippingDestination()}
        <button onClick={() => purchase(id, "Pre Order", preOrderQuantity)}>Pre Order</button><br/>
      </div>
    )
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <div>Purchase Options</div>
        <input type="radio" id="buynow" name="purchase_option" value="Buy Now" checked={purchaseOption === "Buy Now"} onChange={(e) => setPurchaseOption(e.target.value)}/>
        <label htmlFor="buynow">Buy Now</label><br/>
        <input type="radio" id="preorder" name="purchase_option" value="Pre Order" checked={purchaseOption === "Pre Order"} onChange={(e) => setPurchaseOption(e.target.value)}/>
        <label htmlFor="preorder">Pre Order</label><br/>
        {feedbackMessage && <div className="purchase-feedback">{feedbackMessage}</div>}
        {renderBuyNowOption(purchaseOption === "Buy Now")}
        {renderPreOrderOption(purchaseOption === "Pre Order")}
      </div>
    </div>
  )
}


export default PurchasePopUp
