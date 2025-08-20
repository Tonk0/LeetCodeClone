async function collectMetricsUntilContainerStops(container) {
  const peakValues = {
    cpuUsage: 0,
    memoryUsage: 0
  }
  const streamStats = await container.stats({stream: true});
  streamStats.on('data', (data) => {
    const stats = JSON.parse(data.toString());
    if (stats.memory_stats && stats.memory_stats.usage > peakValues.memoryUsage) {
      peakValues.memoryUsage = stats.memory_stats.usage;
    }
    if (stats.cpu_stats && stats.cpu_stats.cpu_usage.total_usage > peakValues.cpuUsage) {
      peakValues.cpuUsage = stats.cpu_stats.cpu_usage.total_usage;
    }
  })
  return new Promise((resolve) => {
    container.wait().then( async () => {
      streamStats.destroy();
      resolve(peakValues);
    });

  })

}

module.exports = collectMetricsUntilContainerStops