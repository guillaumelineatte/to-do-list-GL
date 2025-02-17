import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { Task } from '../models/task.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {}

  getTasks(): Observable<Task[]> {
    return this.firestore
      .collection<Task>('tasks', ref =>
        ref.where('userId', '==', this.authService.getCurrentUser()?.uid)
           .orderBy('order', 'asc')
      )
      .valueChanges({ idField: 'id' });
  }

  addTask(task: Partial<Task>) {
    const userId = this.authService.getCurrentUser()?.uid;
    return this.firestore.collection('tasks').add({
      ...task,
      userId,
      createdAt: new Date(),
      completed: false,
      order: Date.now()
    });
  }

  updateTask(taskId: string, changes: Partial<Task>) {
    return this.firestore
      .collection('tasks')
      .doc(taskId)
      .update(changes);
  }

  deleteTask(taskId: string) {
    return this.firestore
      .collection('tasks')
      .doc(taskId)
      .delete();
  }

  reorderTasks(tasks: Task[]) {
    const batch = this.firestore.firestore.batch();
    tasks.forEach((task, index) => {
      const ref = this.firestore.collection('tasks').doc(task.id).ref;
      batch.update(ref, { order: index });
    });
    return batch.commit();
  }
}
