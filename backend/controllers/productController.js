import sql from '../config/db.js'

async function getAllProducts() {
  const products = await sql`
    select
      p_id, p_name, p_category, p_price
    from products;
  `
  return products;
}

async function getAllProductCategories() {
  const categories = await sql`
    select categories
    from product_categories;
  `
  return categories;
}

export { getAllProducts, getAllProductCategories }
