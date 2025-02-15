function createCodeToRun(testCases, codeTemplate, userCode) {
  let codeToRun = codeTemplate;
  codeToRun = codeToRun.replace('{test_cases}', JSON.stringify(testCases))
  codeToRun = codeToRun.replace('{user_code}', userCode);

  return codeToRun;
}

module.exports = createCodeToRun;