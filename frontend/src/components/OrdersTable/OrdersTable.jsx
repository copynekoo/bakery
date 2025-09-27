import { useState, useEffect } from "react"
import "./OrdersTable.css"

const OrdersTable = function() {
  const [data, setData] = useState("");

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
      <tr className="ordersHeading">
        <th>Order ID</th>
        <th>Product</th>
        <th>Quantity</th>
        <th>Order Creation Date</th>
        <th>Status</th>
        <th>Status Update Date</th>
        <th>Payment Proof</th>
        <th>Shipping Destination</th>
      </tr>
    )
  }

  const TableData = function() {
    return (
      <tr>
        <th>Placeholder 1</th>
        <th>Placeholder 2</th>
        <th>Placeholder 3</th>
        <th>Placeholder 4</th>
        <th>Placeholder 5</th>
        <th>Placeholder 6</th>
        <th>Placeholder 7</th>
        <th>Placeholder 8</th>
      </tr>
    )
  }

  return (
    <Table/>
  )
}

export default OrdersTable