function createCodeToRun(testCases, codeTemplate, userCode) {
  let codeToRun = codeTemplate;
  const randTestCaseName = generateRandomID();
  codeToRun = codeToRun.replace('{test_cases}', JSON.stringify(testCases))
  codeToRun = codeToRun.replace(/test_case/g, randTestCaseName); // чтобы пользователь не мог вывести test_casы внутри своего кода
  codeToRun = codeToRun.replace('{user_code}', userCode);
  return codeToRun;
}

module.exports = createCodeToRun;

function generateRandomID(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for(let i = 0; i<length;i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}