// Notion API Types
export interface NotionProject {
  id: string;
  properties: {
    'Project name': { title: Array<{ plain_text: string }> };
    'People': { people: Array<{ id: string; name?: string }> };
    'Status': { 
      status: { 
        id: string;
        name: 'Planning' | 'In Progress' | 'Paused' | 'Backlog' | 'Done' | 'Canceled';
        color: string;
      } 
    };
    'Completion': { 
      rollup: { 
        type: string;
        number?: number;
        array?: Array<{ type: string; status?: { id: string; name: string } }>;
      } 
    };
    'Dates': { date: { start: string; end?: string } | null };
    'Tasks': { relation: Array<{ id: string }> };
  };
  created_time: string;
  last_edited_time: string;
}

export interface NotionTask {
  id: string;
  properties: {
    'Task name': { title: Array<{ plain_text: string }> };
    'Assign': { people: Array<{ id: string; name?: string }> };
    'Status': { 
      status: { 
        id: string;
        name: 'Not Started' | 'In Progress' | 'Done' | 'Archived';
        color: string;
      } 
    };
    'Due': { date: { start: string; end?: string } | null };
    'Sprint': { relation: Array<{ id: string }> };
    'Project': { relation: Array<{ id: string }> };
    'Is Current Sprint': { rollup: { type: string; boolean?: boolean } };
  };
  created_time: string;
  last_edited_time: string;
}

export interface NotionSprint {
  id: string;
  properties: {
    'Sprint name': { title: Array<{ plain_text: string }> };
    'Dates': { date: { start: string; end: string } | null };
    'Tasks': { relation: Array<{ id: string }> };
    'Is Current Sprint': { formula: { type: string; boolean?: boolean } };
  };
  created_time: string;
  last_edited_time: string;
}

// Dashboard Types
export interface Project {
  id: string;
  name: string;
  owner: string[];
  status: string;
  completion: number;
  dueDate: Date | null;
  tasksCount: number;
  daysUntilDue: number | null;
}

export interface Task {
  id: string;
  name: string;
  assignee: string[];
  status: string;
  dueDate: Date | null;
  sprint: string | null;
  project: string | null;
  isCurrentSprint: boolean;
  daysUntilDue: number | null;
  createdAt: Date;
}

export interface Sprint {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  tasksCount: number;
  isCurrent: boolean;
}

export interface DashboardData {
  projects: Project[];
  tasks: Task[];
  sprints: Sprint[];
  lastUpdate: Date;
}

export interface ProjectsByStatus {
  [key: string]: number;
}

export interface TasksByPerson {
  [key: string]: {
    total: number;
    critical: number;
    blocked: number;
    load: number;
  };
}

export interface VelocityData {
  date: string;
  todo: number;
  inProgress: number;
  done: number;
  blocked: number;
}

export interface SprintVelocityData {
  sprint: string;
  completed: number;
  average: number;
}
