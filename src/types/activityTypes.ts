export type ActivityType =
  | 'TASK_COMPLETED'
  | 'TASK_CREATED'
  | 'OBJECTIVE_CREATED';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  text: string;
  timestamp: string;
}
