import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { TaskService } from '../../../services/task.service';
import { CategoryService } from '../../../services/category.service';
import { Task } from '../../../models/task.model';
import { Category } from '../../../models/category.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks$: Observable<Task[]>;
  categories$: Observable<Category[]>;

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService
  ) {
    this.tasks$ = this.taskService.getTasks();
    this.categories$ = this.categoryService.getCategories();
  }

  ngOnInit() {}

  onDrop(event: CdkDragDrop<Task[]>) {
    const tasks = event.container.data;
    moveItemInArray(tasks, event.previousIndex, event.currentIndex);
    this.taskService.reorderTasks(tasks);
  }

  toggleTaskComplete(task: Task) {
    this.taskService.updateTask(task.id, {
      completed: !task.completed
    });
  }

  deleteTask(taskId: string) {
    this.taskService.deleteTask(taskId);
  }

  getCategoryColor(categoryId: string, categories: Category[]): string {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : '#999';
  }
}
