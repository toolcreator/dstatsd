import { updateStats, getStats, DockerStatsRecord } from "./stats";
import { collectDefaultMetrics, register, Gauge } from "prom-client";
import express from "express";

// TODO get from command line
const intervalMs = 1000;
const port = 9101;//8080;

const LABEL_NAMES = [
  "container_id",
  "container_name"
];
function defaultCollect<T extends string>(g: Gauge<T>, extractMetric: (s: DockerStatsRecord) => number) {
  for (const stat of getStats()) {
    const metric = extractMetric(stat);
    g.labels(stat.id, stat.name).set(metric ? metric : 0);
  }
}

new Gauge({
  name: "dstats_cpu_percent",
  help: "The percentage of the host’s CPU the container is using",
  labelNames: LABEL_NAMES,
  collect() { defaultCollect(this, s => s.cpuPercent); }
});
new Gauge({
  name: "dstats_memory_usage_bytes",
  help: "The total amount of memory the container is using",
  labelNames: LABEL_NAMES,
  collect() { defaultCollect(this, s => s.memUsage); }
});
new Gauge({
  name: "dstats_memory_limit_bytes",
  help: "The total amount of memory the container is allowed to use",
  labelNames: LABEL_NAMES,
  collect() { defaultCollect(this, s => s.memLimit); }
});
new Gauge({
  name: "dstats_memory_percent",
  help: "The percentage of the host’s memory the container is using",
  labelNames: LABEL_NAMES,
  collect() { defaultCollect(this, s => s.memPercent); }
});
new Gauge({
  name: "dstats_network_received_bytes",
  help: "The amount of data the container has received over its network interface",
  labelNames: LABEL_NAMES,
  collect() { defaultCollect(this, s => s.netInp); }
});
new Gauge({
  name: "dstats_network_transmitted_bytes",
  help: "The amount of data the container has transmitted over its network interface",
  labelNames: LABEL_NAMES,
  collect() { defaultCollect(this, s => s.netOut); }
});
new Gauge({
  name: "dstats_block_read_bytes",
  help: "The amount of data the container has read from block devices on the host",
  labelNames: LABEL_NAMES,
  collect() { defaultCollect(this, s => s.blockIn); }
});
new Gauge({
  name: "dstats_block_written_bytes",
  help: "The amount of data the container has written to block devices on the host",
  labelNames: LABEL_NAMES,
  collect() { defaultCollect(this, s => s.blockOut); }
});

const daemon = express();
daemon.get("/metrics", async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err.toString());
  }
});

try {
  collectDefaultMetrics();
  setInterval(updateStats, intervalMs);
  daemon.listen(port)
  console.log(`Listening on port ${port}.`);
  console.log("Metrics are exposed at /metrics endpoint.");
} catch (err) {
  console.log(err);
}
