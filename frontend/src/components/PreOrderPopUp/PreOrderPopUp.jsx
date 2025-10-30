import "./PreOrderPopUp.css"
import { useState, useEffect } from "react"
import axios from "axios"

const PurchasePopUp = function({id, name, price, onClose}) {
  const [preOrderQuantity, setPreOrderQuantity] = useState(1);
  const [defaultShippingDestination, setDefaultShippingDestination] = useState();
  const [customShippingDestination, setCustomShippingDestination] = useState("");

  const purchase = async function(p_id, method, quantity, shippingdestination) {
  try {
    const requestBody = 
    [{
      "order_lines": { 
        "1": {
          product_id: p_id,
          order_method: method,
          quantity: quantity,
        }
      },
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
        {showPreOrderOption(true)}
      </div>
    </div>
  )
}


export default PurchasePopUp