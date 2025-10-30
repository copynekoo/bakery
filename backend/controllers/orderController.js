import sql from '../config/db.js'
import { findCustomerId } from './profileController.js'
import { getProductStock, getProductPrice } from './productItemController.js';

async function getNextOrderId() {
  const nextOrderId = await sql`
    select nextval(pg_get_serial_sequence('orders', 'order_id'));
  `
  return nextOrderId;
}

async function getAllOrders(sort_by_time = "desc", sort_by_status = "All", search_term = "") {
  const timeDirection = sort_by_time === "asc" ? sql`asc` : sql`desc`;
  const filters = [];

  if (sort_by_status !== "All") {
    filters.push(sql`orders.status = ${sort_by_status}`);
  }

  const trimmedSearch = search_term.trim();
  if (trimmedSearch) {
    const searchPattern = `%${trimmedSearch}%`;
    filters.push(
      sql`(
        concat_ws(' ', customers.firstname, customers.lastname) ILIKE ${searchPattern}
        OR customers.firstname ILIKE ${searchPattern}
        OR customers.lastname ILIKE ${searchPattern}
        OR customer_accounts.username ILIKE ${searchPattern}
        OR cast(orders.customer_id as text) ILIKE ${searchPattern}
        OR cast(orders.order_id as text) ILIKE ${searchPattern}
      )`
    );
  }

  const orders = await sql`
    select
      orders.order_id,
      orders.customer_id,
      concat(customers.firstname,' ',customers.lastname) as customer_name,
      orders.tracking_number,
      order_lines.order_method,
      order_lines.product_id,
      products.p_name,
      order_lines.quantity,
      order_lines.product_price,
      orders.order_creation_date,
      orders.status,
      orders.status_update_date,
      orders.payment_proof,
      orders.shipping_destination
    from orders
    join order_lines
      on orders.order_id = order_lines.order_id
    join products on order_lines.product_id = products.p_id
    join customers on orders.customer_id = customers.c_id
    join customer_accounts on customers.c_id = customer_accounts.c_id
    ${filters.length ? sql`where ${sql.join(filters, sql` and `)}` : sql``}
    order by orders.order_creation_date ${timeDirection}
  `;

  return orders;
}

async function getOrder(username, sort_by_time="desc", sort_by_status="All") {
  const customerId = await findCustomerId(username);
  const sortByTime = (sort_by_time === "desc") ? "desc" : "asc";

  const orders = await sql`
    select orders.order_id, order_lines.order_method, order_lines.product_id, orders.tracking_number, products.p_name, order_lines.quantity, order_lines.product_price, orders.order_creation_date, orders.status, orders.status_update_date, orders.payment_proof, orders.shipping_destination
    from orders
    join order_lines
    on orders.order_id = order_lines.order_id
    inner join products ON order_lines.product_id = products.p_id
    where customer_id = ${customerId} ${sort_by_status === 'All' ? sql`` : sql`and status = ${sort_by_status}`}
    order by order_creation_date ${sortByTime === "desc" ? sql`desc` : sql`asc`}
  `
  return orders;
}

async function purchase(username, data) {
  try {
    const customerId = await findCustomerId(username);
    const shippingdestination = data[0].shippingdestination;
    const order_lines = data[0].order_lines;
    const nextOrderId = await getNextOrderId();
    const orderId = nextOrderId[0]['nextval'];

    const orders = await sql`
    insert into orders (order_id, customer_id, order_creation_date, status, status_update_date, payment_proof, shipping_destination)
    values (${orderId}, ${customerId}, DEFAULT, 'Waiting for payment', null, null, ${shippingdestination})
    `
    
    for (const orderKey in order_lines) {
      const order = order_lines[orderKey];
      const product_id = order.product_id;
      const order_method = order.order_method;
      const quantity = order.quantity;
      const productStock = await getProductStock(product_id);
      const productPrice = await getProductPrice(product_id);
      if ((order_method != 'Buy Now') && (order_method != 'Pre Order')) return; // Check if buy method is valid
      if ((order_method == 'Buy Now') && (productStock-quantity < 0)) return; // If using buy now method, then it should has sufficient product stock
      
      await sql`
      insert into order_lines (order_id, product_id, quantity, order_method, product_price)
      values (${orderId}, ${product_id}, ${quantity}, ${order_method}, ${productPrice})
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
    const update_status_date = await sql`
    update orders
    set status_update_date = NOW()
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

async function setStatus(order_id, status) {
  const changeStatus = await sql`
  update orders
  set status = ${status}
  where order_id = ${order_id}
  `

  const updateStatusTime = await sql`
  update orders
  set status_update_date = NOW()
  where order_id = ${order_id}
  `

  return changeStatus;
}

async function setTrackingNumber(order_id, tracking_number) {
  const changeStatus = await sql`
  update orders
  set tracking_number = ${tracking_number}
  where order_id = ${order_id}
  `

  return changeStatus;
}

async function changeStatus(order_id, status, tracking_number=null) {
  const isValid = await validateApprove(order_id, status);
  if (isValid){
    setStatus(order_id, status);
    if (tracking_number){
      setTrackingNumber(order_id, tracking_number);
    }
    return true;
  }
  return false;
}

async function cancelOrder(username, order_id) {
  const customerId = await findCustomerId(username);
  let isValid=false;
  const Status = await getStatus(order_id);
  if ((Status === "Waiting for payment")){ isValid=true; };
    if (isValid){
    const changeStatus = await sql`
      update orders
      set status = 'Cancelled'
      where order_id = ${order_id} and customer_id = ${customerId}
    `
    return changeStatus;
  }
  return false;
}

async function getStatus(order_id) {
  const changeStatus = await sql`
  select status
  from orders
  where order_id = ${order_id}
  `

  return changeStatus[0].status;
}

async function validateApprove(order_id, status) {
  const Status = await getStatus(order_id);
  if ((Status === "Waiting for approval") && (status === "Approved")){ return true };
  if ((Status === "Approved") && (status === "Delivered")){ return true };
  if ((Status !== "Delivered") && (status === "Cancelled"))   { return true };
  return false;  
}

export { getOrder, getAllOrders, purchase, addPayment, getStatus, changeStatus, cancelOrder }
