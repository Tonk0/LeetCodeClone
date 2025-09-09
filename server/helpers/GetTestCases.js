const query = require('../db/db')
async function getTestCases(taskID, limit = null) {
  const testCases = [];
  const testCaseResult = await query('SELECT * FROM Test_Cases WHERE task_id = $1 LIMIT $2', [taskID, limit]);
  testCaseResult.rows.map((testCase) => testCases.push(testCase));
  return testCases;
}
module.exports = getTestCases;