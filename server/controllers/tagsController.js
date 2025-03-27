const query = require('../db/db');

const getTags = async (req, res) => {
  const data = (await query('SELECT * FROM Tags')).rows;
  res.status(200).json(data);
}

module.exports = {
  getTags,
}