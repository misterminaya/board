'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Task } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, subMonths, subWeeks } from 'date-fns';
import { useState } from 'react';

interface BurnUpChartProps {
  tasks: Task[];
}

type TimeRange = '7d' | '15d' | '30d' | '3m' | '6m' | '1y';

export function BurnUpChart({ tasks }: BurnUpChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  // Calculate date range
  const now = new Date();
  const ranges: Record<TimeRange, Date> = {
    '7d': subWeeks(now, 1),
    '15d': subWeeks(now, 2),
    '30d': subMonths(now, 1),
    '3m': subMonths(now, 3),
    '6m': subMonths(now, 6),
    '1y': subMonths(now, 12),
  };

  const startDate = ranges[timeRange];
  
  // Get all days in range
  const days = eachDayOfInterval({ start: startDate, end: now });

  // Calculate cumulative completed tasks per day
  const chartData = days.map((day) => {
    const completed = tasks.filter((task) => {
      if (!task.createdAt) return false;
      try {
        const taskDate = task.createdAt instanceof Date 
          ? task.createdAt 
          : new Date(task.createdAt);
        
        // Skip invalid dates
        if (isNaN(taskDate.getTime())) return false;
        
        return task.status === 'Done' && taskDate <= day;
      } catch {
        return false;
      }
    }).length;

    return {
      date: format(day, 'MMM dd'),
      completed,
      total: tasks.length,
    };
  });

  const timeRangeButtons: { value: TimeRange; label: string }[] = [
    { value: '7d', label: '7d' },
    { value: '15d', label: '15d' },
    { value: '30d', label: '30d' },
    { value: '3m', label: '3m' },
    { value: '6m', label: '6m' },
    { value: '1y', label: '1y' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>📈 Burn-up Chart - Tasks Completados</CardTitle>
          <div className="flex gap-1">
            {timeRangeButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => setTimeRange(btn.value)}
                className={`px-3 py-1 text-sm rounded ${
                  timeRange === btn.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="#10b981"
              strokeWidth={3}
              name="Completados"
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#6b7280"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Total Tasks"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">
              {tasks.filter(t => t.status === 'Done').length}
            </div>
            <div className="text-sm text-gray-600">Completados</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {tasks.filter(t => t.status === 'In Progress').length}
            </div>
            <div className="text-sm text-gray-600">En Progreso</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-600">
              {tasks.length}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
