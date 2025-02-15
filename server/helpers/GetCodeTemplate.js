const query = require('../db/db')
async function getCodeTemplate(taskID, languageID) {
  const templateResult = await query('SELECT test_case_template FROM Task_Templates WHERE task_id = $1 AND programming_language_id = $2', [taskID, languageID]);
  const codeTemplate = templateResult.rows[0].test_case_template;

  return codeTemplate;
}

module.exports = getCodeTemplate;