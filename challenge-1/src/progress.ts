import { MultiProgressBars } from "multi-progress-bars";

const mpb = new MultiProgressBars({
  initMessage: "ETL Pipeline",
  anchor: "bottom",
  persist: true,
  border: true,
});

/**
 * Create a task with a percentage bar in the multi-progress-bar
 *
 * @param taskName - Name of the task
 * @param options  - Additional options for the task
 */
export const createTaskWithPercentage = (
  taskName: string,
  options: any = { type: "percentage" }
) => {
  mpb.addTask(taskName, options);
};

/**
 * Create a task with a indefinite spinner in the multi-progress-bar
 *
 * @param taskName - Name of the task
 * @param options  - Additional options for the task
 */

export const createTaskWithIndefinite = (
  taskName: string,
  options: any = { type: "indefinite" }
) => {
  mpb.addTask(taskName, options);
};

/**
 * Update a task with percentage in the multi-progress-bar
 *
 * @param taskName - Name of the task
 * @param progress - Progress information
 */
export const updateTaskWithPercentage = (taskName: string, progress: any) => {
  mpb.updateTask(taskName, progress);
};

/**
 * Update a task with indefinite spinner in the multi-progress-bar
 *
 * @param taskName - Name of the task
 * @param progress - Progress information
 */
export const updateTaskWithIndefinite = (taskName: string, message: any) => {
  mpb.updateTask(taskName, message);
};

/**
 * Complete a task in the multi-progress-bar
 *
 * @param taskName - Name of the task
 */
export const completeTask = (taskName: string) => {
  mpb.done(taskName);
};

export const completeAllTasks = async () => {
  await mpb.promise;
};

export { mpb };
