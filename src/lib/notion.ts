import { Client } from '@notionhq/client';
import { Project, Task, Sprint } from '@/types';
import { differenceInDays } from 'date-fns';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Helper function to extract plain text from Notion rich text
function getPlainText(richText: any): string {
  if (!richText || richText.length === 0) return '';
  return richText[0].plain_text || '';
}

// Helper function to calculate days until due
function calculateDaysUntilDue(dueDate: Date | null): number | null {
  if (!dueDate) return null;
  return differenceInDays(dueDate, new Date());
}

// Fetch and transform Projects
export async function fetchProjects(): Promise<Project[]> {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_PROJECTS!,
      filter: {
        property: 'Status',
        status: {
          does_not_equal: 'Archived'
        }
      }
    });

    const projects: Project[] = (response.results as any[]).map((page: any) => {
      const properties = page.properties || {};
      const name = getPlainText(properties['Project name']?.title);
      const status = properties['Status']?.status?.name || 'Unknown';
      const people = properties['People']?.people?.map((p: any) => p.name || 'Unassigned') || [];
      const tasksCount = properties['Tasks']?.relation?.length || 0;
      
      // Extract completion percentage
      let completion = 0;
      const rollup = properties['Completion']?.rollup;
      if (rollup?.type === 'number' && rollup.number !== undefined) {
        completion = rollup.number;
      } else if (rollup?.type === 'array' && rollup.array) {
        const doneCount = rollup.array.filter((item: any) => 
          item.type === 'status' && item.status?.name === 'Done'
        ).length;
        completion = rollup.array.length > 0 ? (doneCount / rollup.array.length) * 100 : 0;
      }

      const dateObj = properties['Dates']?.date;
      const dueDate = dateObj?.end ? new Date(dateObj.end) : null;

      return {
        id: page.id,
        name,
        owner: people,
        status,
        completion: Math.round(completion),
        dueDate,
        tasksCount,
        daysUntilDue: calculateDaysUntilDue(dueDate),
      };
    });

    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

// Fetch and transform Tasks
export async function fetchTasks(): Promise<Task[]> {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_TASKS!,
      filter: {
        property: 'Status',
        status: {
          does_not_equal: 'Archived'
        }
      },
      sorts: [
        {
          property: 'Due',
          direction: 'ascending'
        }
      ]
    });

    const tasks: Task[] = (response.results as any[]).map((page: any) => {
      const properties = page.properties || {};
      const name = getPlainText(properties['Task name']?.title);
      const status = properties['Status']?.status?.name || 'Unknown';
      const assignee = properties['Assign']?.people?.map((p: any) => p.name || 'Unassigned') || [];
      
      const dateObj = properties['Due']?.date;
      const dueDate = dateObj?.start ? new Date(dateObj.start) : null;

      const sprint = properties['Sprint']?.relation?.[0]?.id || null;
      const project = properties['Project']?.relation?.[0]?.id || null;
      
      const isCurrentSprintRollup = properties['Is Current Sprint']?.rollup;
      const isCurrentSprint = isCurrentSprintRollup?.type === 'boolean' 
        ? isCurrentSprintRollup.boolean || false 
        : false;

      return {
        id: page.id,
        name,
        assignee,
        status,
        dueDate,
        sprint,
        project,
        isCurrentSprint,
        daysUntilDue: calculateDaysUntilDue(dueDate),
        createdAt: new Date(page.created_time),
      };
    });

    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}

// Fetch and transform Sprints
export async function fetchSprints(): Promise<Sprint[]> {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_SPRINTS!,
      sorts: [
        {
          property: 'Dates',
          direction: 'descending'
        }
      ]
    });

    const sprints: Sprint[] = (response.results as any[]).map((page: any) => {
      const properties = page.properties || {};
      const name = getPlainText(properties['Sprint name']?.title);
      const dateObj = properties['Dates']?.date;
      const tasksCount = properties['Tasks']?.relation?.length || 0;
      
      const isCurrentFormula = properties['Is Current Sprint']?.formula;
      const isCurrent = isCurrentFormula?.type === 'boolean' 
        ? isCurrentFormula.boolean || false 
        : false;

      return {
        id: page.id,
        name,
        startDate: dateObj?.start ? new Date(dateObj.start) : new Date(),
        endDate: dateObj?.end ? new Date(dateObj.end) : new Date(),
        tasksCount,
        isCurrent,
      };
    });

    return sprints;
  } catch (error) {
    console.error('Error fetching sprints:', error);
    return [];
  }
}

// Fetch all data
export async function fetchAllData() {
  const [projects, tasks, sprints] = await Promise.all([
    fetchProjects(),
    fetchTasks(),
    fetchSprints(),
  ]);

  return {
    projects,
    tasks,
    sprints,
    lastUpdate: new Date(),
  };
}
