'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock, Ban, Users } from 'lucide-react';
import { Project, Task } from '@/types';

interface CommandCenterProps {
  projects: Project[];
  tasks: Task[];
}

export function CommandCenter({ projects, tasks }: CommandCenterProps) {
  // Calculate alerts
  const projectsDueSoon = projects.filter(p => 
    p.daysUntilDue !== null && p.daysUntilDue <= 7 && p.status !== 'Done'
  ).length;

  const tasksBlocked = tasks.filter(t => 
    t.status.toLowerCase().includes('blocked')
  ).length;

  const projectsStalled = projects.filter(p => {
    const daysSinceUpdate = Math.floor(
      (new Date().getTime() - new Date(p.dueDate || new Date()).getTime()) / (1000 * 60 * 60 * 24)
    );
    return p.status === 'In Progress' && daysSinceUpdate > 14;
  }).length;

  // Calculate person overload
  const personLoad = new Map<string, number>();
  tasks.forEach(task => {
    task.assignee.forEach(person => {
      personLoad.set(person, (personLoad.get(person) || 0) + 1);
    });
  });
  
  const overloadedPeople = Array.from(personLoad.entries()).filter(
    ([_, count]) => count > 10
  ).length;

  const alerts = [
    {
      icon: Clock,
      severity: 'high',
      count: projectsDueSoon,
      message: `${projectsDueSoon} proyectos vencen esta semana`,
      show: projectsDueSoon > 0
    },
    {
      icon: Ban,
      severity: 'critical',
      count: tasksBlocked,
      message: `${tasksBlocked} tasks bloqueadas >5 días`,
      show: tasksBlocked > 0
    },
    {
      icon: AlertCircle,
      severity: 'medium',
      count: projectsStalled,
      message: `${projectsStalled} proyectos sin avance 14 días`,
      show: projectsStalled > 0
    },
    {
      icon: Users,
      severity: 'medium',
      count: overloadedPeople,
      message: `${overloadedPeople} personas >90% capacidad`,
      show: overloadedPeople > 0
    },
  ];

  const activeAlerts = alerts.filter(a => a.show);

  return (
    <Card className="border-red-200 bg-red-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-700">
          <AlertCircle className="h-5 w-5" />
          🚨 COMMAND CENTER - Requiere Atención
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeAlerts.length === 0 ? (
          <div className="text-center py-4 text-green-600 font-medium">
            ✅ Todo en orden - Sin alertas críticas
          </div>
        ) : (
          <div className="space-y-2">
            {activeAlerts.map((alert, index) => {
              const Icon = alert.icon;
              const severityColors = {
                critical: 'bg-red-600 text-white',
                high: 'bg-orange-500 text-white',
                medium: 'bg-yellow-500 text-white',
              };
              
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200"
                >
                  <Badge className={severityColors[alert.severity as keyof typeof severityColors]}>
                    <Icon className="h-4 w-4 mr-1" />
                    {alert.count}
                  </Badge>
                  <span className="text-sm font-medium">{alert.message}</span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
