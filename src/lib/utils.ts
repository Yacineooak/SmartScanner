import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | number | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}

export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

export function getSeverityColor(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'critical':
      return 'text-error-500';
    case 'high':
      return 'text-error-400';
    case 'medium':
      return 'text-warning-500';
    case 'low':
      return 'text-success-500';
    default:
      return 'text-muted-foreground';
  }
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'open':
      return 'bg-success-500/10 text-success-500';
    case 'closed':
      return 'bg-error-500/10 text-error-500';
    case 'filtered':
      return 'bg-warning-500/10 text-warning-500';
    case 'completed':
      return 'bg-success-500/10 text-success-500';
    case 'failed':
      return 'bg-error-500/10 text-error-500';
    case 'in-progress':
      return 'bg-primary/10 text-primary';
    default:
      return 'bg-secondary text-secondary-foreground';
  }
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}