# docker stats daemon (dstatsd)

dstatsd collects the metrics also provided by the
[`docker stats`](https://docs.docker.com/engine/reference/commandline/stats/) command (see below) from your running
containers and and exposes them via HTTP in a format scrapable by
[Prometheus](https://github.com/prometheus/prometheus).
A multiarch (amd64, arm, arm64) docker image is available at [dockerhub](https://hub.docker.com/r/toolcreator/dstatsd).

Supported metrics:

- [x] CPU %
- [x] MEM %
- [x] MEM USAGE
- [x] MEM LIMIT
- [x] NET I/O
- [x] BLOCK I/O
- [ ] PIDS

## Usage

```shell
$ dstatsd --help
Options:
      --help      Show help                                            [boolean]
      --version   Show version number                                  [boolean]
  -i, --interval  The update interval in milliseconds   [number] [default: 1000]
  -p, --port      The port dstatsd is associated with   [number] [default: 8080]
```

When running, dstatsd listens to the specified port and provides the metrics at the `/metrics` endpoint.

### via Docker

```shell
docker run -v /var/run/docker.sock:/var/run/docker.sock:ro toolcreator/dstatsd
```

The arguments shown above can also be passed, e.g.:

```shell
docker run -v /var/run/docker.sock:/var/run/docker.sock:ro toolcreator/dstatsd -i 10000 -p 12345
```

Using the `--port` option may be particularly useful when running the container with `--network=host`
(i.e., when port mapping is not available).
When available, port mapping can of course be used as well, e.g.:

```shell
docker run -v /var/run/docker.sock:/var/run/docker.sock:ro -p 12345:8080 toolcreator/dstatsd
```

#### docker-compose

```yml
dstatsd:
  image: toolcreator/dstatsd
  command:
    - "--interval=10000"
  ports:
    - '12345:8080'
  volumes:
    - '/var/run/docker.sock:/var/run/docker.sock:ro'
```

Or, with `network_mode: "host"`:

```yml
dstatsd:
  image: toolcreator/dstatsd
  network_mode: "host"
  command:
    - "--interval=10000"
    - "--port=12345"
  volumes:
    - '/var/run/docker.sock:/var/run/docker.sock:ro'
```

### Without Docker

1. Download the source code: `git clone https://github.com/toolcreator/dstatsd.git`
2. Enter the root directory: `cd dstatsd`
3. Install dependencies: `npm install`
4. Compile: `npm build`
5. Make command available globally: `npm link`
6. Run: `dstatsd`

You may also skip step 5 and use `npm start` to run the program instead.
Note, however, that you need to pass arguments in a slightly different way then:

```shell
npm start -- --port 12345 --interval 10000
```

## Metrics

All metrics are of type [gauge](https://prometheus.io/docs/concepts/metric_types/#gauge)
and are labeled with `container_id` and `container_name`.

|Name                            |Description                                                                |
|--------------------------------|---------------------------------------------------------------------------|
|dstats_cpu_percent              |The percentage of the host’s CPU the container is using                    |
|dstats_memory_usage_bytes       |The total amount of memory the container is using                          |
|dstats_memory_limit_bytes       |The total amount of memory the container is allowed to use                 |
|dstats_memory_percent           |The percentage of the host’s memory the container is using                 |
|dstats_network_received_bytes   |The amount of data the container has received over its network interface   |
|dstats_network_transmitted_bytes|The amount of data the container has transmitted over its network interface|
|dstats_block_read_bytes         |The amount of data the container has read from block devices on the host   |
|dstats_block_written_bytes      |The amount of data the container has written to block devices on the host  |

## Acknowledgements

There are numerous people out there who in one way or another helped creating this project,
and I'd like to thank all of them.
However, two projects definitively stand out,
because the code in this repository mainly just glues the two of them together:

- [dockerstats](https://github.com/sebhildebrandt/dockerstats)
- [promclient](https://github.com/siimon/prom-client)
