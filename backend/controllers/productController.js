import sql from '../config/db.js'

async function getAllProducts() {
  const products = await sql`
    select
      p_id, p_name, p_category 
    from products;
  `
  return products;
}

export { getAllProducts }