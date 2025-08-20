const Docker = require('dockerode');
const docker = new Docker();
const collectMetricsUntilContainerStops = require('./GetPeakValues');
const {timeLimitForRuntime} = require('../containersConfig');
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

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({timedOut: true});
    }, timeLimitForRuntime)
  })
  const metricsPromise = collectMetricsUntilContainerStops(container)
    .then(metrics => ({
      timedOut: false,
      ...metrics
    }));

  const result = await Promise.race([timeoutPromise, metricsPromise]);
  if (result.timedOut) {
    return {
      isError: true,
      status: 'Time Limit Exceeded',
    }
  }
  const containerInfo = await container.inspect();
  const errorResult = handleExecutionErrors(containerInfo, userCodeRes, errData);
  if (errorResult) {
    return errorResult;
  }
  return prepareSuccessResult(containerInfo, userCodeRes, result)
}

module.exports = getContainerLogs;

function transformLines(lines) {
  const result = [];
  let currentLogs = [];

  for (let i = 0; i<lines.length;i++) {
    const line = lines[i];
    if (line.includes('userResult')) {
      const userResultObj = JSON.parse(line);
      result.push({
        userLog: [...currentLogs],
        userResult: userResultObj.userResult
      });

      currentLogs = [];
    } else {
      currentLogs.push(line);
    }
  }
  return result;
}

function prepareSuccessResult(containerInfo, userCodeRes, metrics) {
  const runtime = Date.parse(containerInfo.State.FinishedAt) - Date.parse(containerInfo.State.StartedAt);
  const lines = userCodeRes.split('\n').filter((line) => line.length > 0);
    return {
    isError: false,
    result: transformLines(lines),
    runtime,
    cpuUsage: metrics.cpuUsage,
    memoryUsage: metrics.memoryUsage
  }
}

function handleExecutionErrors(containerInfo, userCodeRes, errData) {
  if (containerInfo.State.OOMKilled) {
    return {
      isError: true,
      status: 'Memory Limit Exceeded',
    }
  }
  if (userCodeRes.trim() === 'COMPILATION ERROR') {
    return {
      isError: true,
      status: 'Compilation Error',
      errorData: errData
    }
  }
  if (errData.length > 0) {
    return {
      isError: true,
      status: 'Runtime Error',
      errorData: errData
    }
  }

  return null;
}