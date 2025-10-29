import sql from '../config/db.js'

async function getAllProductItems() {
  const productItems = await sql`
    select
      products.p_id, products.p_name, products.p_category, products.p_price, stocks.remaining_item
    from products
    left join stocks
    on products.p_id = stocks.p_id;
  `
  return productItems;
}

async function getProductStock(product_id) {
  const productItems = await sql`
    select
      products.p_id, stocks.remaining_item
    from products
    left join stocks
    on products.p_id = stocks.p_id
    where products.p_id = ${product_id};
  `
  return productItems[0]['remaining_item'];
}

async function getProductPrice(product_id) {
  const productItems = await sql`
    select
      products.p_price
    from products
    where products.p_id = ${product_id};
  `
  return productItems[0]['p_price'];
}

export { getAllProductItems, getProductStock, getProductPrice }