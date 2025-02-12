const query = require('../../db/db');
const path = require('path');
const fs = require('fs');

async function createCPPTempFile(taskID, languageID, userCode) {
  // достать test_cases
  const testCaseResult = await query('SELECT input, expected_output FROM Test_Cases WHERE task_id = $1', [taskID]);
  const testCases = [];
  testCaseResult.rows.map((testCase) => testCases.push(testCase));

  // достать template для языка и задачи
  const templateResult = await query('SELECT test_case_template FROM Task_Templates WHERE task_id = $1 AND programming_language_id = $2', [taskID, languageID]);
  let codeTemplate = templateResult.rows[0].test_case_template;

  // заменить соответствующие строки в template
  codeTemplate = codeTemplate.replace('{test_cases}', JSON.stringify(testCases));
  codeTemplate = codeTemplate.replace('{user_code}', userCode);

  // вернуть файл
  const filePath = path.normalize(path.join(__dirname, '../../TempFiles', `tempCode-${Date.now()}.cpp`));
  fs.writeFileSync(filePath, codeTemplate);
  return filePath;
}

module.exports = createCPPTempFile;