import "./PurchasePopUp.css"
import { useState, useEffect } from "react"
import axios from "axios"

const PurchasePopUp = function({id, name, price, remainingItem, onClose}) {
  const [purchaseOption, setPurchaseOption] = useState(false);
  const [preOrderQuantity, setPreOrderQuantity] = useState(1);
  const [buyNowQuantity, setBuyNowQuantity] = useState(1);
  const [defaultShippingDestination, setDefaultShippingDestination] = useState();
  const [customShippingDestination, setCustomShippingDestination] = useState("");

  const purchase = async function(p_id, method, quantity, shippingdestination) {
  try {
    const requestBody = 
    [{ 
      product_id: p_id,
      order_method: method,
      quantity: quantity,
      shippingdestination: shippingdestination
    }];
    const response = await axios({
      method: "post",
      url: import.meta.env.VITE_API_DOMAIN + '/' + 'api' + '/' + 'orders' + '/' + 'purchase',
      withCredentials: true,
      data: requestBody
    })
    console.log(response);
      } catch (error) {
        console.log(error);
      }
  }

  useEffect(() => {
  // Make GET request to fetch data
    axios
      .get(import.meta.env.VITE_API_DOMAIN + "/api/profile/defaultshippingdst", {withCredentials: true})
      .then((response) => {
      setDefaultShippingDestination(response.data[0]['defaultshippingdst']);
    });
  }, []);

  const shippingDestination = function(isDefault) {
    if (isDefault) {
      return (
        <textarea id="shippingDstPreview" name="shippingDstPreview" rows="4" cols="30" value={defaultShippingDestination} disabled>
        
        </textarea>
      )
    }

       return (
        <textarea id="shippingDstPreview" name="shippingDstPreview" rows="4" cols="30" value={customShippingDestination} onChange={e => {{setCustomShippingDestination(e.target.value)}
  console.log("Changed", e.target.value)}}>

        </textarea>
      )
  }

  const showBuyNowOption = function(isOpen) {
    const [useDefaultShippingDestination, setUseDefaultShippingDestination] = useState(true);
    if (!isOpen) return null;

    return (
      <div className="buyNowOption">
        <div>Buy Now</div>
        <div>Buying {buyNowQuantity} {name} for each {price}</div>
        <div>Total Price {buyNowQuantity*price} Baht </div>
        <div className="buyNowMenu">Quantity <input type="number" id="quantity" value={buyNowQuantity} onChange={e => setBuyNowQuantity(e.target.value)} name="quantity" min="1" max={remainingItem}/></div>
        <input type="checkbox" id="useShippingDst" name="useShippingDst" value="useShippingDst" checked={useDefaultShippingDestination} onChange={() => setUseDefaultShippingDestination(!useDefaultShippingDestination)}/>
        <label htmlFor="useShippingDst">Use default shipping destination</label><br/><br/>
        {shippingDestination(useDefaultShippingDestination)}
        <button onClick={() => purchase(id, "Buy Now", buyNowQuantity, (useDefaultShippingDestination ? defaultShippingDestination : customShippingDestination))}>Buy Now</button><br/>
      </div>
    )
  }

  const showPreOrderOption = function(isOpen) {
    const [useDefaultShippingDestination, setUseDefaultShippingDestination] = useState(true);
    if (!isOpen) return null;

    return (
      <div className="preOrderOption">
        <div>Pre Order</div>
        <div>Buying {preOrderQuantity} {name} for each {price}</div>
        <div>Total Price {preOrderQuantity*price} Baht </div>
        <div className="preOrderMenu">Quantity <input type="number" id="quantity" value={preOrderQuantity} onChange={e => setPreOrderQuantity(e.target.value)} name="quantity" min="1" max="100"/></div>
        <input type="checkbox" id="useShippingDst" name="useShippingDst" value="useShippingDst" checked={useDefaultShippingDestination} onChange={() => setUseDefaultShippingDestination(!useDefaultShippingDestination)}/>
        <label htmlFor="useShippingDst">Use default shipping destination</label><br/><br/>
        {shippingDestination(useDefaultShippingDestination)}
        <button onClick={() => purchase(id, "Pre Order", preOrderQuantity, (useDefaultShippingDestination ? defaultShippingDestination : customShippingDestination))}>Pre Order</button><br/>
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
        {purchaseOption === "Buy Now" ? showBuyNowOption(true) : showBuyNowOption(false)}
        {purchaseOption === "Pre Order" ? showPreOrderOption(true) : showPreOrderOption(false)}
      </div>
    </div>
  )
}


export default PurchasePopUp