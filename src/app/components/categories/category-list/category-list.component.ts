import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  categories$: Observable<Category[]>;
  categoryForm: FormGroup;
  isEditing = false;
  editingCategoryId: string | null = null;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.categories$ = this.categoryService.getCategories();
    this.initForm();
  }

  ngOnInit() {}

  private initForm(category?: Category) {
    this.categoryForm = this.fb.group({
      name: [category?.name || '', Validators.required],
      color: [category?.color || '#2196F3', Validators.required]
    });
  }

  startEditing(category: Category) {
    this.isEditing = true;
    this.editingCategoryId = category.id;
    this.initForm(category);
  }

  cancelEditing() {
    this.isEditing = false;
    this.editingCategoryId = null;
    this.initForm();
  }

  async onSubmit() {
    if (this.categoryForm.valid) {
      try {
        if (this.isEditing && this.editingCategoryId) {
          await this.categoryService.updateCategory(
            this.editingCategoryId,
            this.categoryForm.value
          );
        } else {
          await this.categoryService.addCategory(this.categoryForm.value);
        }
        this.categoryForm.reset();
        this.isEditing = false;
        this.editingCategoryId = null;
      } catch (error) {
        console.error('Erreur lors de la sauvegarde de la catégorie:', error);
      }
    }
  }

  async deleteCategory(categoryId: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        await this.categoryService.deleteCategory(categoryId);
      } catch (error) {
        console.error('Erreur lors de la suppression de la catégorie:', error);
      }
    }
  }
}
