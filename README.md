# ⏱️ cron-status-server

A tiny **Express + TypeScript** server that runs a recurring cron job and exposes simple HTTP endpoints to **start**, **stop**, and **inspect** it at runtime.

![Node](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-4%2F5-000000?logo=express)
![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- Cron job starts automatically with the server (default: every second)
- Pause/resume the job over HTTP, no restart needed
- Status endpoint reports whether the job is running and when it last ran
- Small, chainable `CronService` wrapper around [`node-cron`](https://github.com/node-cron/node-cron)

## Quick start

```bash
git clone https://github.com/samcraw1/cron-status-server.git
cd cron-status-server
npm install
npm run dev          # or: npm run build && npm start
```

Server runs on `http://localhost:3000` (override with `PORT`).

## API

| Method | Route         | Description                          |
| ------ | ------------- | ------------------------------------ |
| GET    | `/`           | Health check + current cron status   |
| GET    | `/start-cron` | Start the cron job                   |
| GET    | `/stop-cron`  | Stop the cron job                    |
| GET    | `/status`     | `running`/`stopped` + last run time  |

Example:

```bash
$ curl localhost:3000/status
{"status":"running","lastRun":"2026-10-26T19:39:40.001Z","data":{"isRunning":true,"lastRun":"2026-10-26T19:39:40.001Z"}}

$ curl localhost:3000/stop-cron
{"msg":"Cron job has stopped","status":{"isRunning":false,"lastRun":"2026-10-26T19:39:40.001Z"}}
```

## How it works

```ts
const cronJob = new CronService();
cronJob.schedule("*/1 * * * * *", task); // sec min hour day month weekday
cronJob.start();                          // start()/stop() return `this`, so calls chain

app.get("/stop-cron", (req, res) => {
  const status = cronJob.stop().getStatus();
  res.send({ msg: "Cron job has stopped", status });
});
```

Swap the `task` function in `src/index.ts` for your own work (sync jobs, cleanup, polling, etc.) and change the cron expression to taste.

## Project structure

```
src/
  index.ts         # Express app + routes + the scheduled task
  CronService.ts   # schedule / start / stop / getStatus wrapper
```

## License

MIT
