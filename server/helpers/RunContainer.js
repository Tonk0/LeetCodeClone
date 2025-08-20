const languageConfig = require("../languageConfig");
const getTestCases = require('./GetTestCases');
const getCodeTemplate = require('./GetCodeTemplate');
const createCodeToRun = require('./CreateCodeToRun');
const createTempFile = require('./CreateTempFile');
const getContainerLogs = require('./GetContainerLogs');
const createSubmissionObject = require('./CreateSubmissionObject');
const fs = require('fs');

async function runContainer(taskID, lang, userCode) {
  const languageObj = languageConfig[lang];
  const [testCases, codeTemplate] = await Promise.all([
    getTestCases(taskID),
    getCodeTemplate(taskID, lang),
  ]);
  const codeToRun = createCodeToRun(testCases, codeTemplate, userCode);
  const filePath = createTempFile(codeToRun, languageObj.extension);
  const container = await languageObj.createContainer(filePath);
  const resultObject = await getContainerLogs(container);
  const submissionObject = createSubmissionObject(testCases, resultObject);
  fs.unlinkSync(filePath);
  return submissionObject;
}

module.exports = runContainer;