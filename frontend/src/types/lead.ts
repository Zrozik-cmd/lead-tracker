export type LeadStatus = 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'WON' | 'LOST';

export interface Lead {
  id: string;
  name: string;
  email?: string;
  company?: string;
  status: LeadStatus;
  value?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  text: string;
  leadId: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
