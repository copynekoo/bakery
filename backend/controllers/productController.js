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
    select distinct(p_category)
    from products;
  `

  return categories;
}

async function insertProduct(product_id, product_name, product_category, product_price) {
  try {
    const product = await sql`
    insert into products (p_id, p_name, p_category, p_price)
    values (${product_id}, ${product_name}, ${product_category}, ${product_price})
  `
    return true;
  } catch (error) {
    console.error("Error while inserting product");
    return false;
  }
}

async function updateProduct(product_id, product_name, product_category, product_price) {
  try {
    const product = await sql`
    update products
    set p_name=${product_name}, p_category=${product_category}, p_price=${product_price}
    where p_id = ${product_id}
  `
    return true;
  } catch (error) {
    console.error("Error while updating product");
    return false;
  }
}

export { getAllProducts, getAllProductCategories, insertProduct, updateProduct }
