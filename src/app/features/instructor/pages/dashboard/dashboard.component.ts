import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  signal,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  InstructorDashboardService,
  DashboardSummary,
  RevenueData,
  EnrollmentData,
  TopCourse,
  RevenueMonths,
} from '../../../../../app/core/services/InstructorDashboard/instructor-dashboard.service';

declare const ApexCharts: any;

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: '../../pages/dashboard/dashboard.component.html',
})
export class InstructorDashboardComponent implements OnInit, OnDestroy {
  private svc = inject(InstructorDashboardService);
  private destroy$ = new Subject<void>();

  summary = signal<DashboardSummary | null>(null);
  revenueData = signal<RevenueData | null>(null);
  enrollmentData = signal<EnrollmentData | null>(null);
  topCourses = signal<TopCourse[]>([]);

  selectedMonths: RevenueMonths = 12;
  monthsOptions: RevenueMonths[] = [3, 6, 12];
  topSortBy: 'enrollments' | 'revenue' | 'rating' = 'enrollments';

  @ViewChild('revenueChartEl') revenueChartEl!: ElementRef;
  @ViewChild('donutChartEl') donutChartEl!: ElementRef;

  private revenueChart: any = null;
  private donutChart: any = null;

  private readonly baseUrl = 'https://guidy-api-v03-f8dngzewf7ebehea.austriaeast-01.azurewebsites.net';

  publishedPct = computed(() => {
    const s = this.summary();
    if (!s || s.totalCourses === 0) return 0;
    return Math.round((s.publishedCourses / s.totalCourses) * 100);
  });

  draftPct = computed(() => {
    const s = this.summary();
    if (!s || s.totalCourses === 0) return 0;
    return Math.round((s.draftCourses / s.totalCourses) * 100);
  });

  pendingPct = computed(() => {
    const s = this.summary();
    if (!s || s.totalCourses === 0) return 0;
    return Math.round((s.pendingCourses / s.totalCourses) * 100);
  });

  ngOnInit(): void {
    this.loadAll();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.revenueChart?.destroy();
    this.donutChart?.destroy();
  }

  loadAll(): void {
    forkJoin({
      summary: this.svc.getSummary(),
      revenue: this.svc.getRevenue(this.selectedMonths),
      enrollments: this.svc.getEnrollments(this.selectedMonths),
      top: this.svc.getTopCourses(5, this.topSortBy),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ summary, revenue, enrollments, top }) => {
        this.summary.set(summary);
        this.revenueData.set(revenue);
        this.enrollmentData.set(enrollments);
        this.topCourses.set(top);

        setTimeout(() => {
          this.renderRevenueChart(revenue, enrollments);
          this.renderDonutChart(summary);
        }, 0);
      });
  }

  onMonthsChange(): void {
    forkJoin({
      revenue: this.svc.getRevenue(this.selectedMonths),
      enrollments: this.svc.getEnrollments(this.selectedMonths),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ revenue, enrollments }) => {
        this.revenueData.set(revenue);
        this.enrollmentData.set(enrollments);
        this.updateRevenueChart(revenue, enrollments);
      });
  }

  onSortChange(): void {
    this.svc
      .getTopCourses(5, this.topSortBy)
      .pipe(takeUntil(this.destroy$))
      .subscribe((top) => this.topCourses.set(top));
  }

  private renderRevenueChart(revenue: RevenueData, enrollments: EnrollmentData): void {
    if (!this.revenueChartEl) return;

    const labels      = revenue.monthlyRevenue.map((d) => d.label);
    const revenueVals = revenue.monthlyRevenue.map((d) => d.amount);
    const enrollVals  = enrollments.monthlyEnrollments.map((d) => d.count);

    const options = {
      chart: {
        type: 'area',
        height: 320,
        toolbar: { show: false },
        fontFamily: 'inherit',
        background: 'transparent',
        zoom: { enabled: false }
      },
      series: [
        { name: 'Revenue ($)', data: revenueVals },
        { name: 'Enrollments', data: enrollVals },
      ],
      xaxis: {
        categories: labels,
        labels: { style: { colors: '#9ca3af' } }
      },
      yaxis: [
        {
          title: { text: 'Revenue ($)', style: { color: '#6366f1' } },
          labels: { style: { colors: '#9ca3af' } },
        },
        {
          opposite: true,
          title: { text: 'Enrollments', style: { color: '#22c55e' } },
          labels: { style: { colors: '#9ca3af' } },
        },
      ],
      colors: ['#6366f1', '#22c55e'],
      fill: {
        type: 'gradient',
        gradient: { opacityFrom: 0.4, opacityTo: 0.05 },
      },
      stroke: { curve: 'smooth', width: 2 },
      dataLabels: { enabled: false },
      grid: { borderColor: '#f3f4f6' },
      legend: { position: 'top' },
      tooltip: { shared: true, intersect: false },
    };

    this.revenueChart?.destroy();
    this.revenueChart = null;

    if (this.revenueChartEl?.nativeElement) {
      this.revenueChartEl.nativeElement.innerHTML = '';
      this.revenueChart = new ApexCharts(this.revenueChartEl.nativeElement, options);
      this.revenueChart.render();
    }
  }

  private updateRevenueChart(revenue: RevenueData, enrollments: EnrollmentData): void {
    if (!this.revenueChart) {
      this.renderRevenueChart(revenue, enrollments);
      return;
    }
    this.revenueChart.updateOptions({
      xaxis: { categories: revenue.monthlyRevenue.map((d) => d.label) },
    });
    this.revenueChart.updateSeries([
      { name: 'Revenue ($)', data: revenue.monthlyRevenue.map((d) => d.amount) },
      { name: 'Enrollments', data: enrollments.monthlyEnrollments.map((d) => d.count) },
    ]);
  }

  private renderDonutChart(summary: DashboardSummary): void {
    if (!this.donutChartEl) return;

    const options = {
      chart: {
        type: 'donut',
        height: 260,
        fontFamily: 'inherit',
        background: 'transparent',
        zoom: { enabled: false }
      },
      series: [summary.publishedCourses, summary.draftCourses, summary.pendingCourses],
      labels: ['Published', 'Draft', 'Pending'],
      colors: ['#22c55e', '#6366f1', '#f59e0b'],
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total',
                color: '#6b7280',
                formatter: () => String(summary.totalCourses),
              },
            },
          },
        },
      },
      dataLabels: { enabled: false },
      legend: { position: 'bottom' },
      stroke: { width: 0 },
    };

    this.donutChart?.destroy();
    this.donutChart = null;

    if (this.donutChartEl?.nativeElement) {
      this.donutChartEl.nativeElement.innerHTML = '';
      this.donutChart = new ApexCharts(this.donutChartEl.nativeElement, options);
      this.donutChart.render();
    }
  }

  getGrowthClass(val: number): string {
    return val >= 0 ? 'text-green-600' : 'text-red-500';
  }

  getGrowthArrow(val: number): string {
    return val >= 0 ? '↑' : '↓';
  }

  trackByCourseId(_: number, c: TopCourse) {
    return c.courseId;
  }

  statusBadgeClass(status: string): string {
    const map: Record<string, string> = {
      published: 'bg-green-100 text-green-700',
      draft: 'bg-indigo-100 text-indigo-700',
      pending: 'bg-yellow-100 text-yellow-700',
    };
    return map[status.toLowerCase()] ?? 'bg-gray-100 text-gray-600';
  }

  getThumbnailUrl(url: string | null): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${this.baseUrl}${url}`;
  }
}
