const createCPPContainer = require("./helpers/CPP/CreateCPPContainer");
const createJSContainer = require("./helpers/JS/CreateJSContainer");
const createPythonContainer = require("./helpers/Python/CreatePythonContainer");

const languageConfig = {
  'C++': {
    name: 'C++',
    extension: 'cpp',
    createContainer: createCPPContainer
  },
  'Python': {
    name: 'Python',
    extension: 'py',
    createContainer: createPythonContainer
  },
  'Java Script': {
    name: 'Java Script',
    extension: 'js',
    createContainer: createJSContainer
  }
}

module.exports = languageConfig;