const query = require('../db/db')
async function getCodeTemplate(taskID, lang) {
  const templateResult = await query(`
    SELECT test_case_template FROM Task_Templates tt
    JOIN Programming_Languages pl on tt.programming_language_id = pl.id
    WHERE tt.task_id = $1 AND pl.name = $2`, [taskID, lang]);
  const codeTemplate = templateResult.rows[0].test_case_template;

  return codeTemplate;
}

module.exports = getCodeTemplate;