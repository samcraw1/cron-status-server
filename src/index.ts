import express, { Request, Response } from "express";
import { CronService } from "./CronService";

const app = express();
const port = process.env.PORT || 3000;

const task = async () => {
  try {
    console.log(`Task executed at ${new Date().toISOString()}`);
  } catch (error) {
    console.error("Task failed", error);
  }
};

// Every second (6-field cron: sec min hour day month weekday)
const cronJob = new CronService();
cronJob.schedule("*/1 * * * * *", task);
cronJob.start();

app.get("/", (req: Request, res: Response) => {
  const cronStatus = cronJob.getStatus();
  res.send({ msg: "Server is running", cronStatus });
});

app.get("/start-cron", (req: Request, res: Response) => {
  const status = cronJob.start().getStatus();
  res.send({ msg: "Cron job has started", status });
});

app.get("/stop-cron", (req: Request, res: Response) => {
  const status = cronJob.stop().getStatus();
  res.send({ msg: "Cron job has stopped", status });
});

app.get("/status", (req: Request, res: Response) => {
  const status = cronJob.getStatus();
  res.json({
    status: status.isRunning ? "running" : "stopped",
    lastRun: status.lastRun ? status.lastRun.toISOString() : null,
    data: status,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
