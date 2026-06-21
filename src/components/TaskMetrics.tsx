import { 
  Card, 
  DonutChart, 
  Title, 
  Text, 
  Metric, 
  Grid, 
  Flex, 
  ProgressBar, 
  List, 
  ListItem 
} from "@tremor/react";
import { Task } from "@/types/task";

interface TaskMetricsProps {
  tasks: Task[];
}

export function TaskMetrics({ tasks }: TaskMetricsProps) {
  const totalTasks = tasks.length;

  if (totalTasks === 0) return null;

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;

  const completionRate = Math.round((completedTasks / totalTasks) * 100);

  const chartData = [
    { name: "Concluídas", quantidade: completedTasks },
    { name: "Em Andamento", quantidade: inProgressTasks },
    { name: "Pendentes", quantidade: pendingTasks },
  ];

  return (
    <div className="mb-8">
      {/* Adicionei 'dark' na classe principal do Grid se necessário, mas as Cards do Tremor já tratam isso */}
      <Grid numItemsSm={1} numItemsLg={3} className="gap-6">
        
        {/* Card 1: Progresso Geral */}
        <Card decoration="top" decorationColor="blue" className="dark:bg-slate-900 dark:border-slate-800">
          <Text className="dark:text-slate-400">Progresso Geral</Text>
          <Metric className="dark:text-white">{completionRate}%</Metric>
          <Flex className="mt-4">
            <Text className="truncate dark:text-slate-400">
              {completedTasks} de {totalTasks} concluídas
            </Text>
          </Flex>
          <ProgressBar value={completionRate} color="emerald" className="mt-2" />
        </Card>

        {/* Card 2: Resumo de Status */}
        <Card className="dark:bg-slate-900 dark:border-slate-800">
          <Title className="dark:text-white">Resumo de Status</Title>
          <List className="mt-2">
            <ListItem>
              <Flex justifyContent="start" className="gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></span>
                <Text className="dark:text-slate-400">Concluídas</Text>
              </Flex>
              <Text className="font-medium text-gray-900 dark:text-white">{completedTasks}</Text>
            </ListItem>
            
            <ListItem>
              <Flex justifyContent="start" className="gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></span>
                <Text className="dark:text-slate-400">Em Andamento</Text>
              </Flex>
              <Text className="font-medium text-gray-900 dark:text-white">{inProgressTasks}</Text>
            </ListItem>
            
            <ListItem>
              <Flex justifyContent="start" className="gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm"></span>
                <Text className="dark:text-slate-400">Pendentes</Text>
              </Flex>
              <Text className="font-medium text-gray-900 dark:text-white">{pendingTasks}</Text>
            </ListItem>
          </List>
        </Card>

        {/* Card 3: Gráfico Donut */}
        <Card className="flex flex-col justify-center items-center dark:bg-slate-900 dark:border-slate-800">
          <Title className="self-start dark:text-white">Distribuição</Title>
          <DonutChart
            className="mt-4 h-32 w-full"
            data={chartData}
            category="quantidade"
            index="name"
            colors={["emerald", "blue", "amber"]} 
            showAnimation={true}
            showTooltip={true}
          />
        </Card>

      </Grid>
    </div>
  );
}