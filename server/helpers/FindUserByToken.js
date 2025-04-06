const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../jwtConfig');
const query = require('../db/db');
async function findUserByToken(token) {
  let decodedToken = null;
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return null;
    decodedToken = decoded
  });
  if (decodedToken) {
    const user = (await query('SELECT * FROM Users WHERE email = $1 AND username = $2', [decodedToken.email, decodedToken.login])).rows[0];
    return user || null;
  }
  return null;
}

module.exports = findUserByToken;