const query = require('../db/db')
async function getTestCases(taskID) {
  const testCases = [];
  const testCaseResult = await query('SELECT input, expected_output FROM Test_Cases WHERE task_id = $1', [taskID]);
  testCaseResult.rows.map((testCase) => testCases.push(testCase));

  return testCases;
}
module.exports = getTestCases;