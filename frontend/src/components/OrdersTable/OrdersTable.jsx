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
        <TableData/>
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

  const TableData = function() {
    return (
      <tbody>
        {data.map((order) => {
        const order_id = order.order_id;
        const order_method = order.order_method;
        const product_id = order.product_id;
        const quantity = order.quantity;
        const order_creation_date = order.order_creation_date;
        const date = new Date(order_creation_date);
        const formattedOrderCreationDate = date.toLocaleString();
        const status = order.status;
        const status_update_date = order.status_update_date;
        const payment_proof = order.payment_proof;
        const shipping_destination = order.shipping_destination;
        return (
          <TableRow order_id={order_id} order_method={order_method} product_id={product_id} quantity={quantity} formattedOrderCreationDate={formattedOrderCreationDate} status={status} status_update_date={status_update_date} payment_proof={payment_proof} shipping_destination={shipping_destination}/>
        )
        })}
        
      </tbody>
    )
  }

  const TableRow = function({order_id, order_method, product_id, quantity, formattedOrderCreationDate, status, status_update_date, payment_proof, shipping_destination}) {
    const [file, setFile] = useState();

    const upload = async function(order_id) {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios({
        method: "post",
        url: import.meta.env.VITE_API_DOMAIN + '/' + 'api' + '/' + 'orders' + '/' + 'payment',
        withCredentials: true,
        headers: {'order_id': order_id},
        data: formData,
       })
      .then(res => {})
      .catch(er => console.log(er))
    }

    const payment_proof_link = import.meta.env.VITE_API_DOMAIN + "/public/uploads/" + payment_proof
    return (
        <>
          <tr>
            <th>{order_id}</th>
            <th>{order_method}</th>
            <th>{product_id}</th>
            <th>{quantity}</th>
            <th>{formattedOrderCreationDate}</th>
            <th>{status}</th>
            <th>{status_update_date}</th>
            <th><a href={payment_proof_link}>{payment_proof}</a></th>
            <th>{shipping_destination}</th>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button type="button" onClick={() => upload(order_id)}>Upload payment slip</button>
          </tr>
        </>
    )
  }

  return (
    <Table/>
  )
}

export default OrdersTable