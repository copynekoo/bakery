import sql from '../config/db.js'

async function getAllProductItems() {
  const productItems = await sql`
    select
      products.p_id, products.p_name, products.p_category, products.p_price, products.active_sale
    from products
  `
  return productItems;
}

async function getAllActiveProductItems() {
  const productItems = await sql`
    select
      products.p_id, products.p_name, products.p_category, products.p_price, products.active_sale
    from products
    where active_sale = true
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

async function isProductOnSale(product_id) {
  const productOnSale = await sql`
  select
    products.active_sale
  from products
  where p_id = ${product_id}
  `
  return productOnSale[0]['active_sale'];
}

export { getAllProductItems, getProductStock, getProductPrice, getAllActiveProductItems, isProductOnSale }