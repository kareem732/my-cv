import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Categories, SubCategory } from '../../../../core/interfaces/Categories/categories/categories';
import { CategoriesService, CategoryPayload, SubCategoryPayload } from '../../../../core/services/categories/categories/categories.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  imports: [FormsModule,CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {

  categories = signal<Categories[]>([]);
  isLoading = signal(false);
  error = signal('');

  showCategoryModal = signal(false);
  isEditingCategory = signal(false);
  selectedCategory = signal<Categories | null>(null);
  categoryForm = signal<CategoryPayload>({ name: '', description: '', iconUrl: '' });

  showSubCategoryModal = signal(false);
  isEditingSubCategory = signal(false);
  selectedSubCategory = signal<SubCategory | null>(null);
  activeCategoryId = signal<number | null>(null);
  subCategoryForm = signal<SubCategoryPayload>({ name: '', description: '' });

  showDeleteModal = signal(false);
  deleteTarget = signal<{ type: 'category' | 'subcategory'; categoryId: number; subCategoryId?: number } | null>(null);

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.loadCategories();
  }


  loadCategories(): void {
    this.isLoading.set(true);
    this.categoriesService.getCategories().subscribe({
      next: (data) => { this.categories.set(data); this.isLoading.set(false); },
      error: () => { this.error.set('Failed to load categories.'); this.isLoading.set(false); }
    });
  }


  openCreateCategory(): void {
    this.isEditingCategory.set(false);
    this.categoryForm.set({ name: '', description: '', iconUrl: '' });
    this.showCategoryModal.set(true);
  }

  openEditCategory(category: Categories): void {
    this.isEditingCategory.set(true);
    this.selectedCategory.set(category);
    this.categoryForm.set({ name: category.name, description: category.description, iconUrl: category.iconUrl });
    this.showCategoryModal.set(true);
  }

  updateCategoryForm(field: keyof CategoryPayload, value: string): void {
    this.categoryForm.update(f => ({ ...f, [field]: value }));
  }

  submitCategory(): void {
    if (this.isEditingCategory() && this.selectedCategory()) {
      this.categoriesService.updateCategory(this.selectedCategory()!.id, this.categoryForm()).subscribe({
        next: () => { this.loadCategories(); this.closeCategoryModal(); },
        error: () => { this.error.set('Failed to update category.'); }
      });
    } else {
      this.categoriesService.createCategory(this.categoryForm()).subscribe({
        next: () => { this.loadCategories(); this.closeCategoryModal(); },
        error: () => { this.error.set('Failed to create category.'); }
      });
    }
  }

  closeCategoryModal(): void {
    this.showCategoryModal.set(false);
    this.selectedCategory.set(null);
  }


  openCreateSubCategory(categoryId: number): void {
    this.isEditingSubCategory.set(false);
    this.activeCategoryId.set(categoryId);
    this.subCategoryForm.set({ name: '', description: '' });
    this.showSubCategoryModal.set(true);
  }

  openEditSubCategory(categoryId: number, sub: SubCategory): void {
    this.isEditingSubCategory.set(true);
    this.activeCategoryId.set(categoryId);
    this.selectedSubCategory.set(sub);
    this.subCategoryForm.set({ name: sub.name, description: sub.description });
    this.showSubCategoryModal.set(true);
  }

  updateSubCategoryForm(field: keyof SubCategoryPayload, value: string): void {
    this.subCategoryForm.update(f => ({ ...f, [field]: value }));
  }

  submitSubCategory(): void {
    if (!this.activeCategoryId()) return;
    if (this.isEditingSubCategory() && this.selectedSubCategory()) {
      this.categoriesService.updateSubCategory(this.activeCategoryId()!, this.selectedSubCategory()!.id, this.subCategoryForm()).subscribe({
        next: () => { this.loadCategories(); this.closeSubCategoryModal(); },
        error: () => { this.error.set('Failed to update subcategory.'); }
      });
    } else {
      this.categoriesService.createSubCategory(this.activeCategoryId()!, this.subCategoryForm()).subscribe({
        next: () => { this.loadCategories(); this.closeSubCategoryModal(); },
        error: () => { this.error.set('Failed to create subcategory.'); }
      });
    }
  }

  closeSubCategoryModal(): void {
    this.showSubCategoryModal.set(false);
    this.selectedSubCategory.set(null);
    this.activeCategoryId.set(null);
  }


  confirmDeleteCategory(categoryId: number): void {
    this.deleteTarget.set({ type: 'category', categoryId });
    this.showDeleteModal.set(true);
  }

  confirmDeleteSubCategory(categoryId: number, subCategoryId: number): void {
    this.deleteTarget.set({ type: 'subcategory', categoryId, subCategoryId });
    this.showDeleteModal.set(true);
  }

  executeDelete(): void {
    const target = this.deleteTarget();
    if (!target) return;
    if (target.type === 'category') {
      this.categoriesService.deleteCategory(target.categoryId).subscribe({
        next: () => { this.loadCategories(); this.closeDeleteModal(); },
        error: () => { this.error.set('Failed to delete category.'); }
      });
    } else if (target.subCategoryId) {
      this.categoriesService.deleteSubCategory(target.categoryId, target.subCategoryId).subscribe({
        next: () => { this.loadCategories(); this.closeDeleteModal(); },
        error: () => { this.error.set('Failed to delete subcategory.'); }
      });
    }
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.deleteTarget.set(null);
  }
}
