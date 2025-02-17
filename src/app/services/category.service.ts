import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { Category } from '../models/category.model';
import { DEFAULT_CATEGORIES } from '../data/default-categories';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {}

  initializeDefaultCategories() {
    const userId = this.authService.getCurrentUser()?.uid;
    DEFAULT_CATEGORIES.forEach(category => {
      this.firestore.collection('categories').add({
        ...category,
        createdAt: new Date()
      });
    });
  }

  getCategories(): Observable<Category[]> {
    const userId = this.authService.getCurrentUser()?.uid;
    const defaultCategories = this.firestore
      .collection<Category>('categories', ref =>
        ref.where('isDefault', '==', true)
      )
      .valueChanges({ idField: 'id' });

    const userCategories = this.firestore
      .collection<Category>('categories', ref =>
        ref.where('userId', '==', userId)
      )
      .valueChanges({ idField: 'id' });

    return combineLatest([defaultCategories, userCategories]).pipe(
      map(([defaults, userCats]) => [...defaults, ...userCats])
    );
  }

  addCategory(category: Partial<Category>) {
    const userId = this.authService.getCurrentUser()?.uid;
    return this.firestore.collection('categories').add({
      ...category,
      userId,
      isDefault: false,
      createdAt: new Date()
    });
  }

  updateCategory(categoryId: string, changes: Partial<Category>) {
    return this.firestore
      .collection('categories')
      .doc(categoryId)
      .update(changes);
  }

  deleteCategory(categoryId: string) {
    return this.firestore
      .collection('categories')
      .doc(categoryId)
      .delete();
  }
}
