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

    stats = (await dockerContainerStats(containerIdsStr)).map((s, i) => {
      return new DockerStatsRecord(
        s.id,
        containerNames[i],
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

async function update() {
  const stats = await getStats();
  console.log(stats);
}

setInterval(update, intervalMs);
