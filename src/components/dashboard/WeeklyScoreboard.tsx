'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Task } from '@/types';
import { Target, TrendingUp, CheckCircle2 } from 'lucide-react';
import { startOfWeek, endOfWeek } from 'date-fns';

interface WeeklyScoreboardProps {
  tasks: Task[];
}

export function WeeklyScoreboard({ tasks }: WeeklyScoreboardProps) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  // Calculate WIG metrics for this week
  const weekTasks = tasks.filter(t => {
    const taskDate = new Date(t.createdAt);
    return taskDate >= weekStart && taskDate <= weekEnd;
  });

  const completedThisWeek = weekTasks.filter(t => t.status === 'Done').length;
  const inProgressThisWeek = weekTasks.filter(t => t.status === 'In Progress').length;
  const newTasksThisWeek = weekTasks.length;

  // Define WIG (Wildly Important Goal) - customize this
  const weeklyGoal = 40; // Target: Close 40 critical tasks per week
  const progress = (completedThisWeek / weeklyGoal) * 100;

  // Lead measures
  const leadMeasures = [
    {
      label: 'Tasks Nuevas Creadas',
      value: newTasksThisWeek,
      icon: Target,
      color: 'text-blue-600',
    },
    {
      label: 'Tasks Promovidas a "In Progress"',
      value: inProgressThisWeek,
      icon: TrendingUp,
      color: 'text-yellow-600',
    },
    {
      label: 'Tasks Completadas',
      value: completedThisWeek,
      icon: CheckCircle2,
      color: 'text-green-600',
    },
  ];

  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            🎯 Weekly Scoreboard (4DX)
          </span>
          <Badge className="bg-blue-600 text-white">
            Semana actual
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* WIG Progress */}
          <div>
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">
                  WIG: Cerrar {weeklyGoal} tasks críticas
                </span>
                <span className={`text-lg font-bold ${
                  progress >= 100 ? 'text-green-600' :
                  progress >= 75 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {completedThisWeek} / {weeklyGoal}
                </span>
              </div>
              <Progress 
                value={Math.min(progress, 100)} 
                className={`h-4 ${
                  progress >= 100 ? '[&>div]:bg-green-500' :
                  progress >= 75 ? '[&>div]:bg-yellow-500' :
                  '[&>div]:bg-red-500'
                }`}
              />
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {progress >= 100 ? '🎉 ¡Meta alcanzada!' :
               progress >= 75 ? '💪 Buen ritmo, sigue así' :
               progress >= 50 ? '⚡ Acelera para llegar a la meta' :
               '🚨 Necesitas más velocidad'}
            </div>
          </div>

          {/* Lead Measures */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-gray-700">
              Lead Measures (Medidas de Predicción)
            </h4>
            <div className="space-y-2">
              {leadMeasures.map((measure, index) => {
                const Icon = measure.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${measure.color}`} />
                      <span className="text-sm">{measure.label}</span>
                    </div>
                    <span className={`text-xl font-bold ${measure.color}`}>
                      {measure.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Last Update */}
          <div className="text-xs text-gray-500 text-center pt-2 border-t">
            Última actualización: {new Date().toLocaleString('es-PE', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
