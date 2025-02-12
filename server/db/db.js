const pg = require('pg');
const { Client } = pg;
const client = new Client({
  user: 'myuser',
  password: 'mypass',
  host: '127.0.0.1',
  port: '5432',
  database: 'mydb'
});
async function connect() {
  await client.connect();
}

connect().catch(console.error);

function query(text, params) {
  return client.query(text, params);
}

module.exports = query;