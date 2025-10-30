import sql from '../config/db.js'
import { findCustomerId } from './profileController.js'

const normalizeCartRow = (row) => ({
  customerId: row.c_id,
  productId: row.p_id,
  quantity: row.quantity,
  orderMethod: row.order_method ?? 'Buy Now',
  productName: row.p_name,
  productCategory: row.p_category,
  productPrice: row.p_price,
  productActiveSale: row.active_sale,
  remainingStock: row.remaining_item ?? 0,
});

async function fetchCartRows(customerId) {
  const rows = await sql`
    select
      shopping_cart.c_id,
      shopping_cart.p_id,
      shopping_cart.quantity,
      shopping_cart.order_method,
      products.p_name,
      products.p_category,
      products.p_price,
      products.active_sale,
      stocks.remaining_item
    from shopping_cart
    join products on shopping_cart.p_id = products.p_id
    left join stocks on shopping_cart.p_id = stocks.p_id
    where shopping_cart.c_id = ${customerId}
    order by products.p_name
  `;
  return rows.map(normalizeCartRow);
}

async function getCart(username) {
  const customerId = await findCustomerId(username);
  return fetchCartRows(customerId);
}

async function addCartItem(username, productId, quantity, orderMethod = 'Buy Now') {
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than zero");
  }

  const customerId = await findCustomerId(username);
  const [productRow] = await sql`
    select
      products.p_id,
      coalesce(stocks.remaining_item, 0) as remaining_item
    from products
    left join stocks on products.p_id = stocks.p_id
    where products.p_id = ${productId}
  `;

  if (!productRow) {
    throw new Error("Product not found");
  }

  const existingRows = await sql`
    select quantity, order_method
    from shopping_cart
    where c_id = ${customerId} and p_id = ${productId}
  `;

  const existingQuantity = existingRows.length ? existingRows[0].quantity : 0;
  const desiredQuantity = existingQuantity + quantity;
  const existingMethod = existingRows.length ? existingRows[0].order_method : null;
  const effectiveMethod = orderMethod || existingMethod || 'Buy Now';

  if (effectiveMethod === 'Buy Now') {
    if (
      productRow.remaining_item !== null &&
      productRow.remaining_item >= 0 &&
      desiredQuantity > productRow.remaining_item
    ) {
      throw new Error("Requested quantity exceeds available stock");
    }
  }

  if (existingRows.length) {
    await sql`
      update shopping_cart
      set quantity = quantity + ${quantity},
          order_method = ${effectiveMethod}
      where c_id = ${customerId} and p_id = ${productId}
    `;
  } else {
    await sql`
      insert into shopping_cart (c_id, p_id, quantity, order_method)
      values (${customerId}, ${productId}, ${quantity}, ${effectiveMethod})
    `;
  }

  return fetchCartRows(customerId);
}

async function setCartItemQuantity(username, productId, quantity, orderMethod = null) {
  const customerId = await findCustomerId(username);

  if (quantity <= 0) {
    await sql`
      delete from shopping_cart
      where c_id = ${customerId} and p_id = ${productId}
    `;
    return fetchCartRows(customerId);
  }

  const existingRows = await sql`
    select quantity, order_method
    from shopping_cart
    where c_id = ${customerId} and p_id = ${productId}
  `;

  const [productRow] = await sql`
    select
      products.p_id,
      coalesce(stocks.remaining_item, 0) as remaining_item
    from products
    left join stocks on products.p_id = stocks.p_id
    where products.p_id = ${productId}
  `;

  if (!productRow) {
    throw new Error("Product not found");
  }

  const existingMethod = existingRows.length ? existingRows[0].order_method : null;
  const effectiveMethod = orderMethod || existingMethod || 'Buy Now';

  if (effectiveMethod === 'Buy Now') {
    if (
      productRow.remaining_item !== null &&
      productRow.remaining_item >= 0 &&
      quantity > productRow.remaining_item
    ) {
      throw new Error("Requested quantity exceeds available stock");
    }
  }

  if (existingRows.length) {
    await sql`
      update shopping_cart
      set quantity = ${quantity},
          order_method = ${effectiveMethod}
      where c_id = ${customerId} and p_id = ${productId}
    `;
  } else {
    await sql`
      insert into shopping_cart (c_id, p_id, quantity, order_method)
      values (${customerId}, ${productId}, ${quantity}, ${effectiveMethod})
    `;
  }
  return fetchCartRows(customerId);
}

async function removeCartItem(username, productId) {
  const customerId = await findCustomerId(username);
  await sql`
    delete from shopping_cart
    where c_id = ${customerId} and p_id = ${productId}
  `;
  return fetchCartRows(customerId);
}

async function clearCart(username) {
  const customerId = await findCustomerId(username);
  await sql`
    delete from shopping_cart
    where c_id = ${customerId}
  `;
  return [];
}

export { getCart, addCartItem, setCartItemQuantity, removeCartItem, clearCart }
