import { Category } from "../models/category.model";

export const DEFAULT_CATEGORIES: Partial<Category>[] = [
  {
    name: 'Personnel',
    color: '#4CAF50',
    isDefault: true
  },
  {
    name: 'Professionnel',
    color: '#2196F3',
    isDefault: true
  },
  {
    name: 'Urgent',
    color: '#f44336',
    isDefault: true
  },
  {
    name: 'Shopping',
    color: '#9C27B0',
    isDefault: true
  }
];
