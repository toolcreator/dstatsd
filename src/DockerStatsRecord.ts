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
