import "./OrdersDisplayPopUp.css"
import { useState } from 'react';
import axios from "axios";

const changeStatus = async function(order_id, status, trackingNumber){
  const response = await axios.put(import.meta.env.VITE_API_DOMAIN + "/api/orders/status",
    {
      "order_id": order_id,
      "status": status,
      "tracking_number": trackingNumber
    },
    {
      withCredentials: true
    }
  );

  return response;
}

const OrdersDisplayPopUp = function({onClose, onRefresh, data, isCancel}) {  
  const [trackingNumber, setTrackingNumber] = useState("");

  let method;
  if (data.status === "Waiting for approval") method = "approve";
  if (data.status === "Approved") method = "deliver";
  if (isCancel) method = "cancel";
  console.log(method);
  const orderItems = Object.values(data.order_lines);

  const handleApprove = async () => {
    try {
      const response = await changeStatus(data.order_id, "Approved");
      if (response.status === 200) {
        onRefresh();
        onClose();
      }
    } catch (error) {
      alert("Unexpected Error: Please try again.")
      onRefresh();
      onClose();
    }
  };

  const handleCancel = async () => {
    try {
      const response = await changeStatus(data.order_id, "Cancelled");
      if (response.status === 200) {
        onRefresh();
        onClose();
      }
    } catch (error) {
      alert("Unexpected Error: Please try again.")
      onRefresh();
      onClose();
    }
  };

  const handleDeliver = async () => {
    if (!trackingNumber.trim()) {
      alert("Please enter a tracking number");
      return;
    }
    try {
      const response = await changeStatus(data.order_id, "Delivered", trackingNumber);
      if (response.status === 200) {
        onRefresh();
        onClose();
      }
    } catch (error) {
      alert("Unexpected Error: Please try again.")
      onRefresh();
      onClose();
    }
  };

  const approveButton = function(method){
  if (method === "approve"){
    return (
      <>
        <p className="center">
          <button 
            type="button"
            className="resend-payment-slip-btn big-font-btn"
            onClick={handleApprove}>
            Approve Order
          </button>
        </p>
      </>
      )
    } else if (method === "deliver"){
    return (
      <>
        <div className="tracking-input-container">
          <p>
            <label htmlFor="trackingNumber">Tracking Number:</label>
                <input
                  id="trackingNumber"
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="tracking-input"
            />
          </p>
        </div>
        <p className="center">
          <button 
            type="button"
            className="send-payment-slip-btn big-font-btn"
            onClick={handleDeliver}>
            Deliver Order
        </button>
        </p>
      </>
      )
    } else if (method === "cancel"){
      return (
        <>
          <p className="center">
            <button 
              type="button"
              className="send-payment-slip-btn big-font-btn lilred"
              onClick={handleCancel}>
              Cancel Order
            </button>
          </p>
        </>
      )
    }
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <p>Are you sure to {method} for Order #{data.order_id}?</p>
        <p>Customer: {data.customer_name} ({data.customer_id})</p>
        <p>Shipping Destination: {data.shipping_destination}</p>
        <p>Orders:</p>
        <div className="order-items">
          {orderItems.map((item, index) => (
            <p key={index} className="order-item">
              {item.quantity}x {item.p_name}{" "}
              <span className="order-item-method">
                ({item.order_method})
              </span>
            </p>
          ))}
          <p>Total Price: {data.sum_price} Baht</p>
          {approveButton(method)}
        </div>
      </div>
    </div>
  )
}

export default OrdersDisplayPopUp