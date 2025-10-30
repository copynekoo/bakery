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
    } catch (error) {
      console.log(error);
      setFeedbackMessage("Unable to submit pre-order. Please try again.");
    }
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <div className="preOrderOption">
          <div>Pre Order</div>
          <div>Buying {preOrderQuantity} {name} for each {price}</div>
          <div>Total Price {preOrderQuantity*price} Baht </div>
          <div className="preOrderMenu">
            Quantity
            <input
              type="number"
              id="quantity"
              value={preOrderQuantity}
              onChange={(event) => setPreOrderQuantity(Number(event.target.value))}
              name="quantity"
              min="1"
              max="100"
            />
          </div>
          <input
            type="checkbox"
            id="useShippingDst"
            name="useShippingDst"
            value="useShippingDst"
            checked={useDefaultShippingDestination}
            onChange={() => setUseDefaultShippingDestination((prev) => !prev)}
          />
          <label htmlFor="useShippingDst">Use default shipping destination</label><br/><br/>
          <textarea
            id="shippingDstPreview"
            name="shippingDstPreview"
            rows="4"
            cols="30"
            value={useDefaultShippingDestination ? defaultShippingDestination : customShippingDestination}
            disabled={useDefaultShippingDestination}
            onChange={(event) => setCustomShippingDestination(event.target.value)}
          />
          <button onClick={() => purchase(id, preOrderQuantity)}>Pre Order</button><br/>
          {feedbackMessage && <div className="purchase-feedback">{feedbackMessage}</div>}
        </div>
      </div>
    </div>
  )
}

export default PreOrderPopUp
