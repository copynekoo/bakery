import sql from '../config/db.js'

async function findCustomerId(username) {
  const customerId = await sql `
    select c_id
    from customer_accounts
    where username = ${username};
  `
  
  return customerId[0]['c_id'];
}

async function getProfileData(username) {
  const profile = await sql `
    SELECT customer_accounts.username, customer_accounts.c_id, customers.firstname, customers.lastname, customers.defaultshippingdst
    FROM customer_accounts
    JOIN customers ON customer_accounts.c_id=customers.c_id
    WHERE customer_accounts.username = ${username}
  `
  let profileData = (profile.length > 0) ? profile : false;
  return profileData;
}

async function setDefaultShippingDst(username, defaultshippingdst) {
  const customerId = await findCustomerId(username);
  const updateShippingDst = await sql`
    update customers
    set defaultshippingdst = ${defaultshippingdst}
    where c_id = ${customerId}
    `
  return updateShippingDst;
}

export { getProfileData, findCustomerId, setDefaultShippingDst }