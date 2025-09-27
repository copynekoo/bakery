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

async function login(req) {

}

export { findUser, login }
