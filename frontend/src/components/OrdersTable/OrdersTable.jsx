import { useState, useEffect } from "react"
import axios from "axios"
import "./OrdersTable.css"

const OrdersTable = function() {
  const [data, setData] = useState([]);

  useEffect(() => {
  // Make GET request to fetch data
    axios
            .get(import.meta.env.VITE_API_DOMAIN + "/api/orders", {withCredentials: true})
            .then((response) => {
            setData(response.data);
          })
  }, []);

  const Table = function() {
    return (
      <table className="ordersTable">
        <TableHeading/>
        <TableData order_id="axaxaxaxax"/>
      </table>
    )
  }

  const TableHeading = function() {
    return (
      <thead className="ordersHeading">
        <tr>
          <th>Order ID</th>
          <th>Order Method</th>
          <th>Product</th>
          <th>Quantity</th>
          <th>Order Creation Date</th>
          <th>Status</th>
          <th>Status Update Date</th>
          <th>Payment Proof</th>
          <th>Shipping Destination</th>
        </tr>
      </thead>
    )
  }

  const TableData = function({order_id, order_method, product_id, quantity, order_creation_date, status, status_update_date, payment_proof, shipping_destination}) {
    return (
      <tbody>
        {data.map((order) => {
        const order_id = order.order_id;
        const order_method = order.order_method;
        const product_id = order.product_id;
        const quantity = order.quantity;
        const order_creation_date = Date(order.creation_date).toLocaleString();
        const status = order.status;
        const status_update_date = order.status_update_date;
        const payment_proof = order.payment_proof;
        const shipping_destination = order.shipping_destination;
        return (
          <tr>
          <th>{order_id}</th>
          <th>{order_method}</th>
          <th>{product_id}</th>
          <th>{quantity}</th>
          <th>{order_creation_date}</th>
          <th>{status}</th>
          <th>{status_update_date}</th>
          <th>{payment_proof}</th>
          <th>{shipping_destination}</th>
        </tr>
        )
        })}
        
      </tbody>
    )
  }

  return (
    <Table/>
  )
}

export default OrdersTable