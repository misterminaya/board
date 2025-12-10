'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Task } from '@/types';
import { User, AlertTriangle, Ban } from 'lucide-react';

interface CapacityBoardProps {
  tasks: Task[];
}

interface PersonCapacity {
  name: string;
  total: number;
  critical: number;
  blocked: number;
  load: number;
}

export function CapacityBoard({ tasks }: CapacityBoardProps) {
  // Calculate capacity per person
  const capacityMap = new Map<string, PersonCapacity>();

  tasks.forEach((task) => {
    task.assignee.forEach((person) => {
      const current = capacityMap.get(person) || {
        name: person,
        total: 0,
        critical: 0,
        blocked: 0,
        load: 0,
      };

      current.total += 1;
      
      if (task.daysUntilDue !== null && task.daysUntilDue <= 5) {
        current.critical += 1;
      }
      
      if (task.status.toLowerCase().includes('blocked')) {
        current.blocked += 1;
      }

      capacityMap.set(person, current);
    });
  });

  // Calculate load percentage (assuming 10 tasks is 100%)
  const capacities = Array.from(capacityMap.values()).map((c) => ({
    ...c,
    load: Math.min((c.total / 10) * 100, 100),
  })).sort((a, b) => b.load - a.load);

  return (
    <Card>
      <CardHeader>
        <CardTitle>👥 Capacity Planning</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {capacities.map((capacity) => (
            <div
              key={capacity.name}
              className="border rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-semibold">{capacity.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {capacity.critical > 0 && (
                    <Badge className="bg-red-500 text-white text-xs">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {capacity.critical} críticas
                    </Badge>
                  )}
                  {capacity.blocked > 0 && (
                    <Badge className="bg-gray-600 text-white text-xs">
                      <Ban className="h-3 w-3 mr-1" />
                      {capacity.blocked}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {capacity.total} tasks asignadas
                  </span>
                  <span className={`font-medium ${
                    capacity.load > 80 ? 'text-red-600' :
                    capacity.load > 60 ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {Math.round(capacity.load)}% carga
                  </span>
                </div>
                <Progress
                  value={capacity.load}
                  className={`h-2 ${
                    capacity.load > 80 ? '[&>div]:bg-red-500' :
                    capacity.load > 60 ? '[&>div]:bg-yellow-500' :
                    '[&>div]:bg-green-500'
                  }`}
                />
              </div>
            </div>
          ))}

          {capacities.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No hay tasks asignadas todavía
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
