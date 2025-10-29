import { useEffect, useState } from 'react';
import axios from "axios";
import "./OrdersDisplay.css";

const fetchOrdersData = async function(){
  const response = await axios.get(import.meta.env.VITE_API_DOMAIN + "/api/orders",
    {
      params: { format: 'true'},
      withCredentials: true
    });

  return response.data;
}

function OrdersTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(import.meta.env.VITE_API_DOMAIN + "/api/orders",
    {
      params: { format: 'true'},
      withCredentials: true
    }).then(response => setData(response.data));
      // response.data contains the parsed JSON from the API.
      // setUsers(data) updates the React state with that JSON and stores it in state so you can access it.
  }, []);

  return (
    <div className="orders-container">
      <h1 className="orders-title">Orders</h1>

      <div className="orders-list">
        {data.map((order) => {
          const orderDate = new Date(order.order_creation_date).toLocaleString("th-TH", {
            dateStyle: "long",
            timeStyle: "short",
          });

          const orderItems = Object.values(order.order_lines);
          const itemCount = orderItems.length;

          return (
            <div key={order.order_id} className="order-card">
              {/* Header */}
              <div className="order-header">
                <div className="order-info">
                  <h2>Order #{order.order_id}</h2>
                  <p className="order-date">{orderDate}</p>
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
                  {order.status === "pending"
                    ? "Waiting for Approval"
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
                <p className="order-price">฿120</p>
                <button className="accept-order-btn">
                  รับออเดอร์
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrdersTable;
