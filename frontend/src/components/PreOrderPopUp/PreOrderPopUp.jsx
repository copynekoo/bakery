import "./PreOrderPopUp.css"
import { useState, useEffect } from "react"
import axios from "axios"

const PreOrderPopUp = function({id, name, price, onClose}) {
  const [preOrderQuantity, setPreOrderQuantity] = useState(1);
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

  const purchase = async function(p_id, quantity) {
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
          order_lines: {
            "1": {
              product_id: p_id,
              order_method: "Pre Order",
              quantity: quantity,
            }
          },
          shippingdestination: shippingDestinationValue,
        }],
      });
      setFeedbackMessage("Pre-order submitted successfully.");
      onClose();
    } catch (error) {
      console.log(error);
      setFeedbackMessage("Unable to submit pre-order. Please try again.");
    }
  }

  return (
    <div className="modify-popup-modal">
      <div className="modify-popup-modal-content">
        <span className="modify-popup-close" onClick={onClose}>&times;</span>
        <div className="modify-popup-textfield-input-container">

          <p>
            <label>Product ID: {id}</label>
            <label>Product Name: {name}</label>
          </p>

          <div className="products-table-textfield-input-container">
            <p>
              <label htmlFor="quantity">Buy Quantity</label>
                  <input
                    id="quantity"
                    type="number"
                    value={preOrderQuantity}
                    onChange={(e) => setPreOrderQuantity(e.target.value)}
                    className="modify-popup-textfield-input"
                    min="1"
              />
            </p>
          </div>

          <p>
            <label>Total Price: {price*preOrderQuantity} ({price}*{preOrderQuantity})</label>
          </p>

          <p>

          </p>

          <p>

            <p className="modify-popup-on-sale-container">
              <div className="modify-popup-on-sale-item">
                <label htmlFor="onSale" className="inlineOnSale">Use Default Shipping Destination</label>
              </div>
              <div className="modify-popup-on-sale-item">
                <div className="modify-popup-checkbox-wrapper-2">
                  <input type="checkbox" id="onSale" checked={useDefaultShippingDestination} onChange={() => setUseDefaultShippingDestination((prev) => !prev)} className="sc-gJwTLC ikxBAC"/>
                </div>
              </div>

            </p>
                      <textarea
            id="shippingDstPreview"
            name="shippingDstPreview"
            rows="12"
            cols="30"
            style={{ resize: 'none', borderRadius: '8px' }}
            value={useDefaultShippingDestination ? defaultShippingDestination : customShippingDestination}
            disabled={useDefaultShippingDestination}
            onChange={(event) => setCustomShippingDestination(event.target.value)}
          />
              {feedbackMessage && <div className="purchase-feedback">{feedbackMessage}</div>}
            </p>


        <p className="modify-popup-center">
          <button 
            type="button"
            className="modify-popup-resend-payment-slip-btn big-font-btn"
            onClick={() => purchase(id, preOrderQuantity)}>
            Pre Order
          </button>
        </p>
        </div>
      </div>
    </div>
  )
}

export default PreOrderPopUp