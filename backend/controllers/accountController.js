import sql from '../config/db.js'

async function findUser(username) {
  const user = await sql `
    select username, password
    from customer_accounts
    where username = ${username};
  `
  let found = (user.length > 0) ? user : false;
  return found;
}

async function isUserExist(username) {
  const user = await sql `
    select username
    from customer_accounts
    where username = ${username};
  `
  let found = (user.length > 0) ? 1 : 0;
  return found;
}

async function getNextCustomerId() {
  const nextCustomerId = await sql`
    select nextval(pg_get_serial_sequence('customer_accounts', 'c_id'));
  `
  return nextCustomerId;
}

async function register(username, hashedPassword, firstname, lastname) {
  if (await isUserExist(username)) {
    return {status: 500, message: "Account is already exists"};
  }
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
          insert into customers (c_id, firstname, lastname, defaultshippingdst)
          values (${customerId}, ${firstname}, ${lastname}, DEFAULT)
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
export { findUser, register }
