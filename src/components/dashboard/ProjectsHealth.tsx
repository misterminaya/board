'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Project } from '@/types';
import { getStatusColor, getUrgencyBadge, formatDate } from '@/lib/utils';

interface ProjectsHealthProps {
  projects: Project[];
}

export function ProjectsHealth({ projects }: ProjectsHealthProps) {
  // Group by status
  const statusGroups = {
    'Backlog': projects.filter(p => p.status === 'Backlog'),
    'Planning': projects.filter(p => p.status === 'Planning'),
    'In Progress': projects.filter(p => p.status === 'In Progress'),
    'Paused': projects.filter(p => p.status === 'Paused'),
    'Done': projects.filter(p => p.status === 'Done'),
    'Canceled': projects.filter(p => p.status === 'Canceled'),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>📊 Salud del Portafolio</CardTitle>
        <div className="flex gap-2 flex-wrap mt-2">
          {Object.entries(statusGroups).map(([status, items]) => (
            <Badge key={status} className={`${getStatusColor(status)} text-white`}>
              {status}: {items.length}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects
            .filter(p => ['In Progress', 'Planning', 'Paused'].includes(p.status))
            .sort((a, b) => {
              const daysA = a.daysUntilDue ?? Infinity;
              const daysB = b.daysUntilDue ?? Infinity;
              return daysA - daysB;
            })
            .slice(0, 10)
            .map((project) => {
              const urgency = getUrgencyBadge(project.daysUntilDue);
              
              return (
                <div key={project.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{project.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`${getStatusColor(project.status)} text-white text-xs`}>
                          {project.status}
                        </Badge>
                        {urgency && (
                          <Badge className={`${urgency.color} text-white text-xs`}>
                            {urgency.label}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {project.completion}% Complete
                      </div>
                      {project.dueDate && (
                        <div className="text-xs text-gray-500">
                          Due: {formatDate(project.dueDate)}
                        </div>
                      )}
                    </div>
                  </div>

                  <Progress value={project.completion} className="h-2 mb-2" />

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div>
                      👤 {project.owner.join(', ') || 'Unassigned'}
                    </div>
                    <div>
                      📋 {project.tasksCount} tasks
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}
