import sql from '../config/db.js'

async function getAllStocks() {
  const stocks = await sql`
    select
      p_id, remaining_item
    from stocks;
  `
  return stocks;
}

export { getAllStocks }