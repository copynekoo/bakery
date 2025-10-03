import sql from '../../config/db.js'

async function findUser(username) {
  const user = await sql `
    select username, password
    from employees
    where username = ${username};
  `
  let found = (user.length > 0) ? user : false;
  return found;
}

export { findUser }
