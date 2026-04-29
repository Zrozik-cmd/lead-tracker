export const LEAD_STATUSES = [
  { value: '', label: 'All statuses' },
  { value: 'NEW', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'WON', label: 'Won' },
  { value: 'LOST', label: 'Lost' },
] as const;

export type LeadStatusValue = (typeof LEAD_STATUSES)[number]['value'];

export const isValidEmail = (value: string) =>
  value.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
