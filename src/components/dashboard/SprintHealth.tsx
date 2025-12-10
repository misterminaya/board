'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Task, Sprint } from '@/types';
import { Calendar, TrendingUp } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface SprintHealthProps {
  tasks: Task[];
  sprints: Sprint[];
}

export function SprintHealth({ tasks, sprints }: SprintHealthProps) {
  const currentSprint = sprints.find(s => s.isCurrent);
  
  if (!currentSprint) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>🏃 Sprint Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No hay sprint activo en este momento
          </div>
        </CardContent>
      </Card>
    );
  }

  const sprintTasks = tasks.filter(t => t.sprint === currentSprint.id);
  
  const tasksByStatus = {
    'Not Started': sprintTasks.filter(t => t.status === 'Not Started').length,
    'In Progress': sprintTasks.filter(t => t.status === 'In Progress').length,
    'Done': sprintTasks.filter(t => t.status === 'Done').length,
  };

  const completionRate = sprintTasks.length > 0 
    ? (tasksByStatus['Done'] / sprintTasks.length) * 100 
    : 0;

  // Find dragged tasks (tasks from previous sprints)
  const previousSprintIds = sprints
    .filter(s => !s.isCurrent && new Date(s.endDate) < new Date())
    .map(s => s.id);
  
  const draggedTasks = sprintTasks.filter(t => {
    // This is a simplification - in reality you'd track this in task metadata
    return t.status !== 'Done' && new Date(t.createdAt) < new Date(currentSprint.startDate);
  });

  const daysRemaining = Math.ceil(
    (new Date(currentSprint.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  // Safe date formatting
  const formatSprintDate = (date: Date) => {
    try {
      if (!date || isNaN(new Date(date).getTime())) {
        return 'No date';
      }
      return formatDate(date);
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>🏃 Sprint Actual: {currentSprint.name}</span>
          <Badge className="bg-blue-500 text-white">
            <Calendar className="h-3 w-3 mr-1" />
            {daysRemaining} días restantes
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Sprint Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progreso del Sprint</span>
              <span className="text-sm font-bold">{Math.round(completionRate)}%</span>
            </div>
            <Progress value={completionRate} className="h-3" />
          </div>

          {/* Task Distribution */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="border rounded-lg p-3">
              <div className="text-2xl font-bold text-gray-500">
                {tasksByStatus['Not Started']}
              </div>
              <div className="text-xs text-gray-600 mt-1">Por Hacer</div>
            </div>
            <div className="border rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-500">
                {tasksByStatus['In Progress']}
              </div>
              <div className="text-xs text-gray-600 mt-1">En Progreso</div>
            </div>
            <div className="border rounded-lg p-3">
              <div className="text-2xl font-bold text-green-500">
                {tasksByStatus['Done']}
              </div>
              <div className="text-xs text-gray-600 mt-1">Completados</div>
            </div>
          </div>

          {/* Sprint Dates */}
          <div className="bg-gray-50 rounded-lg p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Inicio:</span>
              <span className="font-medium">{formatSprintDate(currentSprint.startDate)}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-gray-600">Fin:</span>
              <span className="font-medium">{formatSprintDate(currentSprint.endDate)}</span>
            </div>
          </div>

          {/* Dragged Tasks Alert */}
          {draggedTasks.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  🔄 {draggedTasks.length} tasks arrastrados del sprint anterior
                </span>
              </div>
              <div className="mt-2 space-y-1">
                {draggedTasks.slice(0, 3).map(task => (
                  <div key={task.id} className="text-xs text-yellow-700">
                    • {task.name}
                  </div>
                ))}
                {draggedTasks.length > 3 && (
                  <div className="text-xs text-yellow-600">
                    ... y {draggedTasks.length - 3} más
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
