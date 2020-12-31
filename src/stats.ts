import { dockerContainers, dockerContainerStats } from 'dockerstats';

let dstats: DockerStatsRecord[] = [];

export class DockerStatsRecord {
  public constructor(
    public id: string,
    public name: string,
    public cpuPercent: number,
    public memUsage: number,
    public memLimit: number,
    public memPercent: number,
    public netInp: number,
    public netOut: number,
    public blockIn: number,
    public blockOut: number,
    // public pids: number
  ) { /* empty */ }
}

export async function updateStats(): Promise<void> {
  try {
    const containers = await dockerContainers();
    if (containers?.length > 0) {
      const containerIdsStr = containers.map(c => c.id).reduce((p, c) => p + ', ' + c);
      const containerNames = containers.map(c => c.name)
      dstats = (await dockerContainerStats(containerIdsStr)).map((s, i) => {
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
      //console.log(dstats);
    }
  } catch (err) {
    console.log(err);
  }
}

export function getStats(): DockerStatsRecord[] {
  return dstats;
}
