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
    const trimmedCategory = (product_category ?? '').trim()
    const numericPrice = Number(product_price)

    if (!trimmedCategory) {
      throw new Error('Product category is required')
    }

    if (Number.isNaN(numericPrice)) {
      throw new Error('Product price must be a number')
    }

    await sql`
      insert into product_categories (categories)
      values (${trimmedCategory})
      on conflict (categories) do nothing
    `

    await sql`
      insert into products (p_id, p_name, p_category, p_price, active_sale)
      values (${product_id}, ${product_name}, ${trimmedCategory}, ${numericPrice}, false)
    `
    return true;
  } catch (error) {
    console.error("Error while inserting product", {
      product_id,
      error: error.message,
    });
    return false;
  }
}

async function updateProduct(product_id, product_name, product_category, product_price, product_active_sale) {
  try {
    const product = await sql`
    update products
    set p_name=${product_name}, p_category=${product_category}, p_price=${product_price}, active_sale=${product_active_sale}
    where p_id = ${product_id}
  `
    return true;
  } catch (error) {
    console.error("Error while updating product");
    return false;
  }
}

async function deleteProduct(product_id) {
  try {
    const deleteProduct = await sql`
    delete from products
    where p_id = ${product_id}
    `
    return true;
  } catch (error) {
    console.error("Error while deleting product");
    return false;
  }
}

export { getAllProducts, getAllProductCategories, insertProduct, updateProduct, deleteProduct }
