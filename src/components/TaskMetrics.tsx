import { Task } from "@/types/task";

interface TaskMetricsProps {
  tasks: Task[];
}

export function TaskMetrics({ tasks }: TaskMetricsProps) {
  const totalTasks = tasks.length;

  if (totalTasks === 0) {
    return null;
  }

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "in_progress"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "pending"
  ).length;

  const completionRate = Math.round(
    (completedTasks / totalTasks) * 100
  );

  const completedPercentage = (completedTasks / totalTasks) * 100;
  const inProgressPercentage = (inProgressTasks / totalTasks) * 100;
  const pendingPercentage = (pendingTasks / totalTasks) * 100;

  const donutBackground = `conic-gradient(
    #10b981 0% ${completedPercentage}%,
    #3b82f6 ${completedPercentage}% ${completedPercentage + inProgressPercentage}%,
    #f59e0b ${completedPercentage + inProgressPercentage}% 100%
  )`;

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 border-t-4 border-t-blue-600 bg-white p-6 shadow-sm dark:border-slate-800 dark:border-t-blue-500 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Progresso Geral
          </p>

          <p className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">
            {completionRate}%
          </p>

          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            {completedTasks} de {totalTasks} concluídas
          </p>

          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
            Resumo de Status
          </h2>

          <ul className="mt-4 divide-y divide-gray-200 dark:divide-slate-800">
            <li className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Concluídas
                </span>
              </div>

              <span className="font-medium text-slate-950 dark:text-white">
                {completedTasks}
              </span>
            </li>

            <li className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Em Andamento
                </span>
              </div>

              <span className="font-medium text-slate-950 dark:text-white">
                {inProgressTasks}
              </span>
            </li>

            <li className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Pendentes
                </span>
              </div>

              <span className="font-medium text-slate-950 dark:text-white">
                {pendingTasks}
              </span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
            Distribuição
          </h2>

          <div className="flex flex-1 items-center justify-center py-4">
            <div
              className="relative h-32 w-32 rounded-full"
              style={{ background: donutBackground }}
              aria-label="Gráfico de distribuição das tarefas"
            >
              <div className="absolute inset-6 flex items-center justify-center rounded-full bg-white dark:bg-slate-900">
                <span className="text-xl font-bold text-slate-950 dark:text-white">
                  {totalTasks}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Concluídas
            </span>

            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              Em andamento
            </span>

            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              Pendentes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
