export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export interface Occasion {
  id: string;
  text: string;
  color: 'birthday' | 'holiday' | 'meeting' | 'deadline' | 'celebration' | 'personal';
  createdAt: Date;
}

export interface DayTasks {
  [dateKey: string]: Task[];
}

export interface DayOccasions {
  [dateKey: string]: Occasion[];
}

export type ViewMode = 'single' | 'double' | 'triple';