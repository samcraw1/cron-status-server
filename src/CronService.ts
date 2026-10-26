import cron, { ScheduledTask } from "node-cron";

export interface CronStatus {
  isRunning: boolean;
  lastRun: Date | null;
}

export class CronService {
  private job: ScheduledTask | null = null;
  private expression = "";
  private task: () => void | Promise<void> = () => {};
  private running = false;
  private lastRun: Date | null = null;

  schedule(expression: string, task: () => void | Promise<void>): this {
    if (!cron.validate(expression)) {
      throw new Error(`Invalid cron expression: ${expression}`);
    }
    this.job?.stop();
    this.expression = expression;
    this.task = task;
    this.job = null;
    this.running = false;
    return this;
  }

  start(): this {
    if (this.running) return this;
    if (!this.expression) throw new Error("Call schedule() before start()");
    this.job = cron.schedule(this.expression, async () => {
      this.lastRun = new Date();
      await this.task();
    });
    this.running = true;
    return this;
  }

  stop(): this {
    this.job?.stop();
    this.job = null;
    this.running = false;
    return this;
  }

  getStatus(): CronStatus {
    return { isRunning: this.running, lastRun: this.lastRun };
  }
}
