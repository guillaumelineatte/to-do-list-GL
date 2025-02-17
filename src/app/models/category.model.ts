export interface Category {
  id: string;
  name: string;
  color: string;
  isDefault: boolean;
  userId?: string; // null pour les catégories prédéfinies
  createdAt: Date;
}
