import sql from '../config/db.js'
import { findCustomerId } from './profileController.js'

async function getOrder(username) {
  const customerId = await findCustomerId(username);
  const orders = await sql`
    select orders.order_id, order_lines.order_method, order_lines.product_id, order_lines.quantity, orders.order_creation_date, orders.status, orders.status_update_date, orders.payment_proof, orders.shipping_destination
    from orders
    join order_lines
    on orders.order_id = order_lines.order_id
    where customer_id = ${customerId};
  `
  return orders;
}

export { getOrder }