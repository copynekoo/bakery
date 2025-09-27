import sql from '../config/db.js'

async function getNextCustomerId() {
  const nextCustomerId = await sql`
    select nextval(pg_get_serial_sequence('customer_accounts', 'c_id'));
  `
  return nextCustomerId;
}

async function register(username, hashedPassword, firstname, lastname) {
  const nextCustomerId = await getNextCustomerId();
  const customerId = nextCustomerId[0]['nextval'];

  try {
    const [customer_account, customer] = await sql.begin(async sql => {
      const [customer_account] = await sql`
        insert into customer_accounts (username, password, c_id)
        values (${username}, ${hashedPassword}, ${customerId})
        returning *
      `

      const [customer] = await sql`
        insert into customers (c_id, firstname, lastname)
        values (${customerId}, ${firstname}, ${lastname})
        returning *
      `

      return [customer_account, customer]
    })
  } catch (error) {
    return {
      status: 500,
      error: "Registration failed."
    }
  }
  return {
    status: 200,
    success: "Registration success."
  };
}
export { register }