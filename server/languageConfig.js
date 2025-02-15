const createCPPContainer = require("./helpers/CPP/CreateCPPContainer");
const createJSContainer = require("./helpers/JS/CreateJSContainer");
const createPythonContainer = require("./helpers/Python/CreatePythonContainer");

const languageConfig = {
  1: {
    name: 'C++',
    extension: 'cpp',
    createContainer: createCPPContainer
  },
  2: {
    name: 'Python',
    extension: 'py',
    createContainer: createPythonContainer
  },
  3: {
    name: 'Java Script',
    extension: 'js',
    createContainer: createJSContainer
  }
}

module.exports = languageConfig;