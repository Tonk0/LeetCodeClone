const path = require('path');
const fs = require('fs');
function createTempFile(codeToRun, extension) {
  const filePath = path.normalize(path.join(__dirname, '../TempFiles', `tempCode-${Date.now()}.${extension}`))
  fs.writeFileSync(filePath, codeToRun);
  return filePath;
}
module.exports = createTempFile;