import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Category, HomeService } from '../../../../../core/services/homeService/home-service.service';

@Component({
  selector: 'app-categories-bar',
  standalone: true,
  imports: [],
  templateUrl: './categories-bar.component.html',
})
export class CategoriesBarComponent implements OnInit {
  private homeService = inject(HomeService);
  private router      = inject(Router);

  @Output() categorySelected = new EventEmitter<Category>();

  categories: Category[]    = [];
  activeCategory: Category | null = null;
  activeOffsetLeft = 0;
  loading = true;

  ngOnInit(): void {
    this.homeService.getCategories().subscribe({
      next: data => {
        this.categories = data;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  setActive(cat: Category, event: MouseEvent): void {
    this.activeCategory = this.activeCategory?.id === cat.id ? null : cat;
    if (this.activeCategory) {
      const btn = event.currentTarget as HTMLElement;
      this.activeOffsetLeft = btn.getBoundingClientRect().left;
    }
    this.categorySelected.emit(cat);
  }

  isActive(cat: Category): boolean {
    return this.activeCategory?.id === cat.id;
  }

  navigateToSub(categoryId: number, subCategoryId: number): void {
    this.activeCategory = null;
    this.router.navigate(['/courses'], {
      queryParams: { categoryId, subCategoryId }
    });
  }

  navigateToCategory(categoryId: number): void {
    this.activeCategory = null;
    this.router.navigate(['/courses'], { queryParams: { categoryId } });
  }

  closeDropdown(): void {
    this.activeCategory = null;
  }
}
