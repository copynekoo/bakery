import sql from '../config/db.js'
import { findCustomerId } from './profileController.js'
import { getProductStock } from './productItemController.js';

async function getNextOrderId() {
  const nextOrderId = await sql`
    select nextval(pg_get_serial_sequence('orders', 'order_id'));
  `
  return nextOrderId;
}

async function getAllOrders() {
  const orders = await sql`
    select orders.order_id, orders.customer_id, order_lines.order_method, order_lines.product_id, products.p_name, order_lines.quantity, orders.order_creation_date, orders.status, orders.status_update_date, orders.payment_proof, orders.shipping_destination
    from orders
    join order_lines
    on orders.order_id = order_lines.order_id
    inner join products ON order_lines.product_id = products.p_id
  `
  return orders;
}

async function getOrder(username) {
  const customerId = await findCustomerId(username);
  const orders = await sql`
    select orders.order_id, order_lines.order_method, order_lines.product_id, products.p_name, order_lines.quantity, orders.order_creation_date, orders.status, orders.status_update_date, orders.payment_proof, orders.shipping_destination
    from orders
    join order_lines
    on orders.order_id = order_lines.order_id
    inner join products ON order_lines.product_id = products.p_id
    where customer_id = ${customerId};
  `
  return orders;
}

async function purchase(username, data) {
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
      const productStock = await getProductStock(product_id);
      if ((order_method != 'Buy Now') && (order_method != 'Pre Order')) return; // Check if buy method is valid
      if ((order_method == 'Buy Now') && (productStock-quantity < 0)) return; // If using buy now method, then it should has sufficient product stock
      
      const order_lines = await sql`
      insert into order_lines (order_id, product_id, quantity, order_method)
      values (${orderId}, ${product_id}, ${quantity}, ${order_method})
      `
    }
  } catch (error) {
    return {
      status: 500,
      error: "Purchase failed."
    }
  }
  return {
    status: 200,
    success: "Purchase success."
  };
}

async function checkStatus(username, order_id) {
  const customerId = await findCustomerId(username);
  const checkStatus = await sql`
    select orders.status
    from orders
    where customer_id = ${customerId} and order_id = ${order_id};
  `
  return checkStatus[0]['status']
}

async function addPayment(username, order_id, file) {
  const customerId = await findCustomerId(username);
  const check_status = await checkStatus(username, order_id);

  if (check_status === 'Waiting for payment') {
    const changeStatus = await sql`
          update orders
          set status = 'Waiting for approval'
          where customer_id = ${customerId} and order_id = ${order_id};
        `
  }

  const orders = await sql`
    update orders
    set payment_proof = ${file}
    where customer_id = ${customerId} and order_id = ${order_id};
  `
  return orders;
}

async function changeStatus(order_id, status) {
  const approval = await sql`
  update orders
  set status = ${status}
  where order_id = ${order_id}
  `

  return approval;
}

export { getOrder, getAllOrders, purchase, addPayment, changeStatus}