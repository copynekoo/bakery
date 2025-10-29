import { useEffect, useState, useRef } from 'react';
import axios from "axios";
import "./OrdersDisplay.css";

const calculatePrice = function(order){
  let sum_price = 0;
  const order_lines = order.order_lines;
  for (const order_line in order_lines) {
    const product_price = Number(order_lines[order_line].product_price);
    const product_quantity = Number(order_lines[order_line].quantity);
    const totalPrice = product_price*product_quantity
    sum_price += totalPrice;
  }
  return sum_price;
}

const fetchOrdersData = async function(){
  const response = await axios.get(import.meta.env.VITE_API_DOMAIN + "/api/orders",
    {
      params: {
        format: 'true',
        sort_by_time: 'desc',
      },
      withCredentials: true
    });

  return response.data;
}

function OrdersTable() {
  const [data, setData] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedStatusQuery, setSelectedStatusQuery] = useState('');
  const fileInputRef = useRef(null);

  const upload = async function(order_id, file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios({
      method: "post",
      url: import.meta.env.VITE_API_DOMAIN + '/' + 'api' + '/' + 'orders' + '/' + 'payment',
      withCredentials: true,
      headers: {'order_id': order_id},
      data: formData,
      })
    .then(res => {
      setRefreshTrigger(prev => prev+1);
    })
    .catch(er => console.log(er))
  }

  const handleButtonClick = (orderId) => {
    fileInputRef.current?.setAttribute('data-order-id', orderId);
    fileInputRef.current?.click();
  };

  const handleFileChange = function(event) {
    const orderId = event.target.getAttribute('data-order-id');
    const file = event.target.files[0];
    if (file) {
      console.log('Selected file:', file.name);
      upload(orderId, file);
    }
  };

  useEffect(() => {
    axios.get(import.meta.env.VITE_API_DOMAIN + "/api/orders",
    {
      params: { format: 'true'},
      withCredentials: true
    }).then(response => setData(response.data));
  }, [refreshTrigger]);

  return (
    <div className="orders-container">
      <h1 className="orders-title">Orders</h1>

      <div className="orders-list">
        {data.map((order) => {
          const orderDate = new Date(order.order_creation_date).toLocaleString("en-EN", {
            dateStyle: "long",
            timeStyle: "short",
          });
          


          const orderItems = Object.values(order.order_lines);
          const payment_proof_link = import.meta.env.VITE_API_DOMAIN + "/public/uploads/" + order.payment_proof
          const itemCount = orderItems.length;
          let orderUpdateDate = null;

          if (order.status_update_date){
              orderUpdateDate = new Date(order.status_update_date).toLocaleString("en-EN", {
              dateStyle: "long",
              timeStyle: "short",
            });
          }

          return (
            <div key={order.order_id} className="order-card">
              {/* Header */}
              <div className="order-header">
                <div className="order-info">
                  <h2>Order #{order.order_id}</h2>
                  <p className="order-date">Created: {orderDate}</p>
                  {orderUpdateDate && (<p className="order-date">Updated: {orderUpdateDate}</p>)}
                  <p className="order-item-count">
                    {itemCount} item{itemCount > 1 ? "s" : ""}
                  </p>
                  <p className="order-shipping">
                    {order.shipping_destination}
                  </p>
                </div>

                <span
                  className={`order-status ${
                    order.status === "Delivered" ? "status-delivered" : "status-pending"
                  }`}
                >
                  {order.status === "Waiting for approval"
                    ? "Waiting for approval"
                    : order.status}
                </span>
              </div>

              {/* Items */}
              <div className="order-items">
                {orderItems.map((item, index) => (
                  <p key={index} className="order-item">
                    {item.quantity}x {item.p_name}{" "}
                    <span className="order-item-method">
                      ({item.order_method})
                    </span>
                  </p>
                ))}
              </div>

              {/* Footer */}
              <div className="order-footer">
                <p className="order-price">{calculatePrice(order)} Baht</p>

                {/* Right Side */}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  {order.payment_proof && (
                    <a href={payment_proof_link} className="paymentProof">View payment proof</a>
                  )}
                  {!order.payment_proof && (
                    <button 
                      type="button"
                      className="send-payment-slip-btn"
                      onClick={() => handleButtonClick(order.order_id)}>
                      Upload payment slip
                    </button>
                  )}
                  {order.payment_proof && (
                    <button 
                      type="button"
                      className="send-payment-slip-btn resend-payment-slip-btn"
                      onClick={() => handleButtonClick(order.order_id)}>
                      Reupload payment slip
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrdersTable;
