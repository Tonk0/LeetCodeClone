const rateLimit = require('express-rate-limit');

const baseContainerOption = {
  AttachStdout: true,
  AttachStderr: true,
  HostConfig: {
    AutoRemove: true,
    Memory: 64*1024*1024,
  }
}
const timeLimitForRuntime = 5500;

// В целом, это ограничивает запуск контейнеров
const submissionLimiter = rateLimit({
  windowMs: 3000,
  max: 1,
  message: JSON.stringify({message: 'Слишком много запросов'})
})

module.exports = {baseContainerOption, timeLimitForRuntime, submissionLimiter}
