import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | null | undefined): string {
  if (!date) return 'No date';
  
  try {
    const parsedDate = date instanceof Date ? date : new Date(date);
    
    // Check if date is valid
    if (isNaN(parsedDate.getTime())) {
      return 'Invalid date';
    }
    
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    }).format(parsedDate);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

export function getStatusColor(status: string): string {
  const colors: { [key: string]: string } = {
    'Backlog': 'bg-gray-500',
    'Planning': 'bg-blue-500',
    'In Progress': 'bg-yellow-500',
    'Paused': 'bg-purple-500',
    'Done': 'bg-green-500',
    'Canceled': 'bg-red-500',
    'Not Started': 'bg-gray-500',
    'Archived': 'bg-gray-400',
  };
  return colors[status] || 'bg-gray-500';
}

export function getUrgencyBadge(daysUntilDue: number | null): { label: string; color: string } | null {
  if (daysUntilDue === null || isNaN(daysUntilDue)) return null;
  
  if (daysUntilDue < 0) {
    return { label: 'OVERDUE', color: 'bg-red-600' };
  } else if (daysUntilDue <= 2) {
    return { label: '🔥 URGENT', color: 'bg-red-500' };
  } else if (daysUntilDue <= 7) {
    return { label: '⚠️ SOON', color: 'bg-orange-500' };
  }
  
  return null;
}
