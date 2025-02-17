export interface Task {
  id: string;
  title: string;
  description?: string;
  categoryId: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  dueDate: Date;
  completed: boolean;
  createdAt: Date;
  userId: string;
  order: number;
  notificationSettings?: {
    enabled: boolean;
    emailEnabled: boolean;
    notifyAt: Date;
  };
  subtasks?: SubTask[];
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  order: number;
}
