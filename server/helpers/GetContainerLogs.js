const Docker = require('dockerode');
const docker = new Docker();
async function getContainerLogs(container) {
  let userCodeRes = '';
  let errData = '';
  await container.start();
  const logs = await container.logs({
    follow: true,
    stderr: true,
    stdout: true,
    timestamps: false,
    stream: true
  });
  docker.modem.demuxStream(logs, {
    write: function(chunk) {
      userCodeRes += chunk.toString('utf8');
    }
  }, {
    write: function(chunk) {
      errData += chunk.toString('utf8');
    }
  });
  await container.wait();
  const inspectData = await container.inspect();
  if (userCodeRes.trim() === 'COMPILATION ERROR') {  // Ошибка может возникнуть внутри cpp-контейнера
    return {
      success: false,
      type: 'Compilation error',
      error: errData
    }
  }
  if (errData.length > 0) {
    return {
      success: false,
      type: 'Runtime error',
      error: errData
    }
  }
  const lines = userCodeRes.split('\n').filter((line) => line.length > 0);
  const result = lines.map((line) => JSON.parse(line))
  return {
    success: true,
    result
  }
  // const res = await container.wait();
  // // if (res.StatusCode !== 0) {
  // //   return {
  // //     success: false,
  // //     error: errData
  // //   }
  // // }
  // console.log(res.StatusCode)
  // console.log('UserRes:')
  // console.log(userCodeRes);
  // console.log('ErrorRes:')
  // console.log(errData);
  // if (errData.length > 0) {
  //   return {
  //     success: false,
  //     error: errData
  //   }
  // }

  // return {
  //   success: true,
  //   result
  // }
}

module.exports = getContainerLogs;