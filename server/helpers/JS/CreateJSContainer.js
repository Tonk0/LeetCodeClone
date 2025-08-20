const path = require('path');
const Docker = require('dockerode');
const docker = new Docker();
const { baseContainerOption } = require('../../containersConfig');
async function createJSContainer(filePath) {
  const fileName = path.basename(filePath);
  const containerVolumePath = '/app/userCode';
  const container = await docker.createContainer({
    Image: 'node:20-alpine',
    Cmd: ['node', path.join(containerVolumePath, fileName)],
    ...baseContainerOption,
    HostConfig: {
      ...baseContainerOption.HostConfig,
      Binds: [`${filePath}:${path.join(containerVolumePath, fileName)}`]
    }
  });
  return container;
}

module.exports = createJSContainer;