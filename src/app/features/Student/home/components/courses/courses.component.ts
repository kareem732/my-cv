import { Component, OnInit, OnDestroy, inject, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { CourseCardComponent } from '../course-card/course-card.component';
import { HomeService, CourseCard, Category, CoursesFilter, PaginatedCourses, SearchSuggestion } from '../../../../../core/services/homeService/home-service.service';
import { SearchService } from '../../../../../core/services/Search/search.service';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [FormsModule, CourseCardComponent],
  templateUrl: './courses.component.html',
})
export class CoursesComponent implements OnInit, OnDestroy {
  private homeService   = inject(HomeService);
  private searchService = inject(SearchService);
  private router        = inject(Router);
  private destroy$      = new Subject<void>();
  private searchInput$  = new Subject<string>();

  courses: CourseCard[]  = [];
  categories: Category[] = [];
  loading  = true;
  error    = false;

  suggestions: SearchSuggestion[] = [];
  showSuggestions    = false;
  suggestionsLoading = false;
  isShowingPopular   = false;
  private suggestions$ = new Subject<string>();

  filter: CoursesFilter = {
    pageIndex: 1,
    pageSize:  12,
  };

  totalCount = 0;
  totalPages = 0;
  hasNext    = false;
  hasPrev    = false;

  readonly levels    = ['Beginner', 'Intermediate', 'Advanced'];
  readonly languages = ['English', 'Arabic'];
  readonly sortOptions: { label: string; value: CoursesFilter['sortBy'] }[] = [
    { label: 'Newest',       value: 'newest'     },
    { label: 'Price: Low',   value: 'price_asc'  },
    { label: 'Price: High',  value: 'price_desc' },
    { label: 'Top Rated',    value: 'rating'     },
  ];

  get skeletons(): number[] {
    return Array(12).fill(0).map((_, i) => i);
  }

  get filteredCourses(): CourseCard[] {
    if (!this.filter.search?.trim()) return this.courses;
    const q = this.filter.search.toLowerCase();
    return this.courses.filter(c => c.title.toLowerCase().includes(q));
  }

// في courses.component.ts
getImageUrl(url: string | null | undefined): string {
  if (!url) return 'https://placehold.co/480x270?text=Course';
  if (url.startsWith('http')) return url;
  return `https://guidy-api-v03-f8dngzewf7ebehea.austriaeast-01.azurewebsites.net${url}`;
}

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showSuggestions = false;
  }

  ngOnInit(): void {
    this.homeService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.categories = data);

    this.searchInput$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => this.loadCourses());

    this.suggestions$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(q => {
      if (!q.trim()) {
        this.suggestions      = [];
        this.showSuggestions  = false;
        this.isShowingPopular = false;
        return;
      }

      this.isShowingPopular   = false;
      this.suggestionsLoading = true;

      this.searchService.getSuggestions(q)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: res => {
            this.suggestions        = res;
            this.showSuggestions    = res.length > 0;
            this.suggestionsLoading = false;
          },
          error: () => {
            this.suggestionsLoading = false;
          }
        });
    });

    this.loadCourses();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

 loadCourses(): void {
  this.loading = true;
  this.error   = false;

  this.homeService.getCourses(this.filter)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res: PaginatedCourses) => {
        this.courses = res.data.sort((a, b) => {
          const priceA = a.discountPrice ?? a.price;
          const priceB = b.discountPrice ?? b.price;

          if (this.filter.sortBy === 'price_desc') return priceB - priceA;
          if (this.filter.sortBy === 'price_asc')  return priceA - priceB;
          return 0;
        });
        this.totalCount = res.totalCount;
        this.totalPages = res.totalPages;
        this.hasNext    = res.hasNext;
        this.hasPrev    = res.hasPrevious;
        this.loading    = false;
      },
      error: () => {
        this.error   = true;
        this.loading = false;
      }
    });
}

  applyFilter(): void {
    this.filter.pageIndex = 1;
    this.loadCourses();
  }

  onSearchInput(): void {
    this.searchInput$.next(this.filter.search ?? '');
    this.suggestions$.next(this.filter.search ?? '');
  }

  onSearchFocus(): void {
    if (this.suggestions.length > 0) {
      this.showSuggestions = true;
      return;
    }

    if (!this.filter.search?.trim()) {
      this.suggestionsLoading = true;
      this.isShowingPopular   = true;

      this.searchService.getPopular(6)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: res => {
            this.suggestions = res.map(c => ({
              courseId:     c.id,
              title:        c.title,
              category:     c.subCategoryName,
              thumbnailUrl: c.thumbnailUrl,
            }));
            this.showSuggestions    = this.suggestions.length > 0;
            this.suggestionsLoading = false;
          },
          error: () => {
            this.suggestionsLoading = false;
            this.isShowingPopular   = false;
          }
        });
    }
  }

  selectSuggestion(suggestion: SearchSuggestion): void {
    this.showSuggestions  = false;
    this.isShowingPopular = false;
    this.router.navigate(['/student/courses', suggestion.courseId]);
  }

  setLevel(level: string): void {
    this.filter.level = this.filter.level === level ? undefined : level;
    this.applyFilter();
  }

  setLanguage(lang: string): void {
    this.filter.language = this.filter.language === lang ? undefined : lang;
    this.applyFilter();
  }

  setSort(val: CoursesFilter['sortBy']): void {
    this.filter.sortBy = val;
    this.applyFilter();
  }

  setCategory(categoryId: number): void {
    this.filter.categoryId    = this.filter.categoryId === categoryId ? undefined : categoryId;
    this.filter.subCategoryId = undefined;
    this.applyFilter();
  }

  setSubCategory(categoryId: number, subId: number): void {
    this.filter.categoryId    = categoryId;
    this.filter.subCategoryId = this.filter.subCategoryId === subId ? undefined : subId;
    this.applyFilter();
  }

  clearFilters(): void {
    this.filter           = { pageIndex: 1, pageSize: 12 };
    this.suggestions      = [];
    this.showSuggestions  = false;
    this.isShowingPopular = false;
    this.loadCourses();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.filter.pageIndex = page;
    this.loadCourses();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get pages(): number[] {
    const total = this.totalPages;
    const cur   = this.filter.pageIndex ?? 1;
    const delta = 2;
    const range: number[] = [];
    for (let i = Math.max(1, cur - delta); i <= Math.min(total, cur + delta); i++) {
      range.push(i);
    }
    return range;
  }

  get hasActiveFilters(): boolean {
    return !!(
      this.filter.search ||
      this.filter.categoryId ||
      this.filter.subCategoryId ||
      this.filter.level ||
      this.filter.language ||
      this.filter.sortBy
    );
  }
}
