const _ = require('lodash');

function createSubmissionObject(testCases, resultObject) {
  if (resultObject.isError) {
    return {
      ...resultObject
    }
  }
  const solutionInfo = isSolutionRight(testCases, resultObject.result); // если тесткейс неправильный - вернется инфа и по нему
  if (solutionInfo.isCorrect) {
    return {
      isError: resultObject.isError,
      status: 'Accepted',
      runtime: resultObject.runtime,
      memory: resultObject.memoryUsage,
      cpu: resultObject.cpuUsage,
      numOfTestCases:  testCases.length,
      ...solutionInfo
    }
  } else {
    return {
      isError: resultObject.isError,
      status: 'Wrong Answer',
      ...solutionInfo
    }
  }
}
module.exports = createSubmissionObject;
function isSolutionRight(testCases, userResults) {
  for(let i = 0;i<testCases.length;i++) {
    if (!userResults[i] || !_.isEqual(testCases[i].expected_output,userResults[i].userResult)) {
      return {
        isCorrect: false,
        wrongTestCase: i+1,
        numOfTestCases: testCases.length,
        testCase: testCases[i],
        userOutput: userResults[i]?.userResult || null,
        userLog: userResults[i]?.userLog || null
      }
    }
  }
  return {
    isCorrect: true
  }
}