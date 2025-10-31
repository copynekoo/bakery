import { useEffect, useState, useRef } from 'react';
import axios from "axios";
import "./OrdersDisplay.css";
import { useNavigate } from "@tanstack/react-router";
import Select from 'react-select';

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

const StatusQueryOptions = [
  { value: 'all', label: 'All' },
  { value: 'need_pay', label: 'Waiting for payment' },
  { value: 'need_approval', label: 'Waiting for approval' },
  { value: 'approved', label: 'Approved'},
  { value: 'delivered', label: 'Delivered'},
  { value: 'cancelled', label: 'Cancelled'}
];

const DirectionQueryOptions = [
  { value: 'desc', label: 'Latest' },
  { value: 'asc', label: 'Oldest' }
];

function OrdersTable() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedStatusQuery, setSelectedStatusQuery] = useState({ value: 'all', label: 'All' });
  const [selectedTimeQuery, setSelectedTimeQuery] = useState({ value: 'desc', label: 'Latest' });
  const fileInputRef = useRef(null);

  const cancelOrder = async function(order_id){
    await axios.put(import.meta.env.VITE_API_DOMAIN + "/api/orders/",
      {
        "order_id": order_id
      },
      {
        withCredentials: true
      }
    );
  }

  const upload = async function(order_id, file) {
    const formData = new FormData();
    formData.append('file', file);
    try {
      await axios({
        method: "post",
        url: import.meta.env.VITE_API_DOMAIN + '/' + 'api' + '/' + 'orders' + '/' + 'payment',
        withCredentials: true,
        headers: {'order_id': order_id},
        data: formData,
      });
      setRefreshTrigger(prev => prev+1);
    } catch (error) {
      console.log(error);
    }
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

  const onCancelPopUp = function(order){
    const order_id = order.order_id;
    if (window.confirm("Are you sure to cancel Order #"+order_id+"?") == true) {
      cancelOrder(order_id).then(() => setRefreshTrigger(prev => prev+1));
    }
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_API_DOMAIN + "/api/orders", {
          params: { 
            format: 'true',
            sort_by_time: selectedTimeQuery.value,
            sort_by_status: selectedStatusQuery.label,
          },
          withCredentials: true
        });
        
        if (response.status === 401) {
          throw new Error('Unauthorized');
        }
        
        setData(response.data);
      } catch (err) {
        navigate({ to: "/login" });
      }
    };

    fetchOrders();
  }, [refreshTrigger, selectedStatusQuery, selectedTimeQuery]);

  return (
    <div className="orders-container">
      <h1 className="orders-title">Orders</h1>
      <div className="dropdown">
        <div className="dropdown-field">
          <span className="dropdown-label">Status</span>
          <Select
            classNamePrefix="dropdown-select"
            defaultValue={selectedStatusQuery}
            onChange={setSelectedStatusQuery}
            options={StatusQueryOptions}
          />
        </div>
        <div className="dropdown-field">
          <span className="dropdown-label">Sort by Time</span>
          <Select
            classNamePrefix="dropdown-select"
            defaultValue={selectedTimeQuery}
            onChange={setSelectedTimeQuery}
            options={DirectionQueryOptions}
          />
        </div>
      </div>
  
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
                  <p className="order-date lilgray">Created: {orderDate}</p>
                  {orderUpdateDate && (<p className="order-date lilgray">Updated: {orderUpdateDate}</p>)}
                  <p className="order-item-count">
                    {itemCount} item{itemCount > 1 ? "s" : ""}
                  </p>
                  <p className="order-shipping">
                    {order.shipping_destination}
                  </p>
                </div>

                <div className="order-status-bar">
                  <span
                    className={`order-status ${
                      order.status === "Delivered" ? "status-delivered" : "status-pending"
                    }`}
                  >
                    {order.status === "Waiting for approval"
                      ? "Waiting for approval"
                      : order.status}
                  </span>
                  <div className="lilgray">{order.tracking_number}</div>
                </div>

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
                  {(order.status === "Waiting for payment") && (
                    <a className="cancel-order" onClick={() => onCancelPopUp(order)}>Cancel Order</a>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  {(!order.payment_proof && order.status !== "Cancelled" && order.status !== "Delivered") && (
                    <button 
                      type="button"
                      className="send-payment-slip-btn"
                      onClick={() => handleButtonClick(order.order_id)}>
                      Upload payment slip
                    </button>
                  )}
                  {order.payment_proof && (
                    <a href={payment_proof_link} className="paymentProof">View payment proof</a>
                  )}
                  {(order.payment_proof && (order.status === "Waiting for payment" || order.status === "Waiting for approval")) && (
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
