const path = require('path');
const Docker = require('dockerode');
const docker = new Docker();
async function createCPPContainer(filePath) {
  const fileName = path.basename(filePath);
  const containerVolumePath = '/app/userCode';
  const container = await docker.createContainer({
    Image: 'gcc-with-json',
    Cmd: [
      'bash', '-c',
      `g++ -I/usr/include -o /app/userCode/code /app/userCode/${fileName} && /app/userCode/code || echo "COMPILATION ERROR"`
    ],
    AttachStdout: true,
    AttachStderr: true,
    HostConfig: {
      AutoRemove: true,
      Binds: [`${filePath}:${path.join(containerVolumePath, fileName)}`]
    }
  });
  return container;
}

module.exports = createCPPContainer;