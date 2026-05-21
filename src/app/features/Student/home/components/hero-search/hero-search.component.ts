import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil, of } from 'rxjs';
import { HomeService, SearchSuggestion } from '../../../../../core/services/homeService/home-service.service';

@Component({
  selector: 'app-hero-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './hero-search.component.html',
})
export class HeroSearchComponent implements OnInit, OnDestroy {
  private homeService = inject(HomeService);
  private router      = inject(Router);
  private destroy$    = new Subject<void>();
  private input$      = new Subject<string>();

  query        = '';
  suggestions: SearchSuggestion[] = [];
  showDropdown = false;
  loading      = false;

  ngOnInit(): void {
    this.input$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(q => {
        if (q.trim().length < 2) { this.suggestions = []; return of([]); }
        this.loading = true;
        return this.homeService.getSearchSuggestions(q);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: results => {
        this.suggestions = results;
        this.showDropdown = results.length > 0;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onInput(): void {
    this.input$.next(this.query);
  }

  search(): void {
    if (!this.query.trim()) return;
    this.showDropdown = false;
    this.router.navigate(['/courses'], { queryParams: { search: this.query.trim() } });
  }

  selectSuggestion(s: SearchSuggestion): void {
    this.query = s.title;
    this.showDropdown = false;
    this.router.navigate(['/courses', s.courseId]);
  }

  onBlur(): void {
    setTimeout(() => { this.showDropdown = false; }, 150);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
