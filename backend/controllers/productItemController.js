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

export { getAllProductItems }