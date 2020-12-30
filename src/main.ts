import { DockerStatsRecord } from './DockerStatsRecord';
import { dockerContainers, dockerContainerStats } from 'dockerstats';

const intervalMs = 1000;

async function getStats() {
  let stats : DockerStatsRecord[] = [];

  const containers = await dockerContainers();
  if (containers) {
    const containerIds = containers.map(c => c.id);
    const containerIdsStr = containerIds.reduce((p, c) => p + ', ' + c);
    const containerNames = containers.map(c => c.name)
    stats = (await dockerContainerStats(containerIdsStr)).map(s => {
      return new DockerStatsRecord(
        s.id,
        containerNames[containerIds.findIndex(id => id == s.id)],
        s.cpu_percent,
        s.mem_usage,
        s.mem_limit,
        s.mem_percent,
        s.netIO.rx,
        s.netIO.wx,
        s.blockIO.r,
        s.blockIO.w
      );
    });
  }
  return stats;
}

setInterval(
  async () => {
    await getStats();
  },
  intervalMs
);
