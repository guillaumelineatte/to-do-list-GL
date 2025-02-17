import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';
import { Task } from '../../../models/task.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  categories$: Observable<Category[]>;
  isEditMode = false;
  taskId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.categories$ = this.categoryService.getCategories();
    this.initForm();
  }

  ngOnInit() {
    this.taskId = this.route.snapshot.paramMap.get('id');
    if (this.taskId) {
      this.isEditMode = true;
      this.loadTask(this.taskId);
    }
  }

  private initForm() {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      categoryId: ['', Validators.required],
      priority: ['MEDIUM', Validators.required],
      dueDate: ['', Validators.required],
      notificationSettings: this.fb.group({
        enabled: [false],
        emailEnabled: [false],
        notifyAt: ['']
      }),
      subtasks: this.fb.array([])
    });
  }

  private loadTask(taskId: string) {
    // Implémenter le chargement de la tâche pour l'édition
  }

  get subtasks() {
    return this.taskForm.get('subtasks') as FormArray;
  }

  addSubtask() {
    this.subtasks.push(this.fb.group({
      title: ['', Validators.required],
      completed: [false]
    }));
  }

  removeSubtask(index: number) {
    this.subtasks.removeAt(index);
  }

  async onSubmit() {
    if (this.taskForm.valid) {
      try {
        if (this.isEditMode && this.taskId) {
          await this.taskService.updateTask(this.taskId, this.taskForm.value);
        } else {
          await this.taskService.addTask(this.taskForm.value);
        }
        this.router.navigate(['/tasks']);
      } catch (error) {
        console.error('Erreur lors de la sauvegarde de la tâche:', error);
      }
    }
  }
}
