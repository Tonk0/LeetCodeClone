const query = require('../db/db');
const getTestCases = require('../helpers/GetTestCases');

const getFirstThreeTestCases = async (req, res) => {
  const {id} = req.params;

  const data = await getTestCases(id, 3);

  if (data.length <= 0) {
    return res.status(500).json({message: 'Что-то пошло не так'});
  }
  res.status(200).json(data);
}


module.exports = {getFirstThreeTestCases}