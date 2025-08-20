const path = require('path');
const Docker = require('dockerode');
const docker = new Docker();
const { baseContainerOption } = require('../../containersConfig');
async function createPythonContainer(filePath) {
  const fileName = path.basename(filePath);
  const containerVolumePath = '/app/userCode';
  const container = await docker.createContainer({
    Image: 'python:3.13.2-alpine',
    Cmd: ['python', path.join(containerVolumePath, fileName)],
    ...baseContainerOption,
    HostConfig: {
      ...baseContainerOption.HostConfig,
      Binds: [`${filePath}:${path.join(containerVolumePath, fileName)}`]
    }
  });
  return container;
}

module.exports = createPythonContainer;