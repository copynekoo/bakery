import sql from '../config/db.js'
import { findCustomerId } from './profileController.js'

async function getNextOrderId() {
  const nextOrderId = await sql`
    select nextval(pg_get_serial_sequence('orders', 'order_id'));
  `
  return nextOrderId;
}

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

async function preOrder(username, data) {
  try {
    const customerId = await findCustomerId(username);
    const shippingdestination = data[0]['shippingdestination'];
    const nextOrderId = await getNextOrderId();
    const orderId = nextOrderId[0]['nextval'];

    const orders = await sql`
    insert into orders (order_id, customer_id, order_creation_date, status, status_update_date, payment_proof, shipping_destination)
    values (${orderId}, ${customerId}, DEFAULT, 'Waiting for payment', null, null, ${shippingdestination})
    `
    
    for (const key in data) {
      const product_id = data[key]['product_id'];
      const order_method = data[key]['order_method'];
      const quantity = data[key]['quantity'];
      
      const order_lines = await sql`
      insert into order_lines (order_id, product_id, quantity, order_method)
      values (${orderId}, ${product_id}, ${quantity}, ${order_method})
      `
    }
  } catch (error) {
    return {
      status: 500,
      error: "Pre Order failed."
    }
  }
  return {
    status: 200,
    success: "Pre Order success."
  };
}

export { getOrder, preOrder }