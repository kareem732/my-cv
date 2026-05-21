import {
  Component, OnInit, OnDestroy, inject, signal,
  ElementRef, ViewChild, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../core/services/Admin/admin.service';
import { AdminStats } from '../../../../core/interfaces/Admin/Admin-Stats/admin-stats';

declare const ApexCharts: any;

interface MonthlyEntry {
  label: string;
  amount: number;
  count: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private adminService = inject(AdminService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('chartElement') chartElement!: ElementRef;

  stats = signal<AdminStats | null>(null);
  loading = signal<boolean>(true);

  selectedMonths = 6;
  monthsOptions = [3, 6, 12];

  private chart: any = null;

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading.set(true);
    this.stats.set(null);
    this.adminService.getAdminStats(this.selectedMonths).subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
        this.cdr.detectChanges();
        setTimeout(() => this.renderChart(data), 0);
      },
      error: () => this.loading.set(false)
    });
  }

  onMonthsChange(): void {
    this.loadStats();
  }

  private renderChart(data: AdminStats): void {
    const fallback: MonthlyEntry[] = Array(this.selectedMonths)
      .fill(null)
      .map(() => ({ label: '-', amount: 0, count: 0 }));

    const months: MonthlyEntry[] =
      data.monthlyRevenue && data.monthlyRevenue.length > 0
        ? data.monthlyRevenue.map(m => ({
            label:  m.label  ?? '-',
            amount: m.amount ?? 0,
            count:  m.count  ?? 0
          }))
        : fallback;

    const revenueData: number[] = months.map(m => m.amount);
    const enrollData:  number[] = months.map(m => m.count);
    const labels:      string[] = months.map(m => m.label);

    const maxRevenue = Math.max(...revenueData, 10);
    const maxEnroll  = Math.max(...enrollData,  5);

    const options = {
      series: [
        { name: 'Revenue ($)', type: 'area',   data: revenueData },
        { name: 'Enrollments', type: 'column', data: enrollData  }
      ],
      chart: {
        height: 350,
        type: 'line',
        stacked: false,
        toolbar: { show: false },
        fontFamily: 'Inter, sans-serif',
        background: 'transparent',
        animations: { enabled: true },
        zoom: { enabled: false }
      },
      stroke:      { width: [4, 0], curve: 'smooth' },
      plotOptions: { bar: { columnWidth: '20%', borderRadius: 4 } },
      fill: {
        type: ['gradient', 'solid'],
        gradient: { opacityFrom: 0.4, opacityTo: 0.05 }
      },
      colors: ['#1C64F2', '#312e81'],
      grid:   { borderColor: '#E5E7EB', strokeDashArray: 4 },
      theme:  { mode: 'light' },
      xaxis: {
        categories: labels,
        labels: { style: { colors: '#6B7280' } },
        axisBorder: { show: false },
        axisTicks:  { show: false }
      },
      yaxis: [
        {
          min: 0,
          max: maxRevenue,
          title:  { text: 'Revenue ($)', style: { color: '#6B7280', fontWeight: 400 } },
          labels: { style: { colors: '#6B7280' } }
        },
        {
          opposite: true,
          min: 0,
          max: maxEnroll,
          title:  { text: 'Enrollments', style: { color: '#6B7280', fontWeight: 400 } },
          labels: { style: { colors: '#6B7280' } }
        }
      ],
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        labels: { colors: '#6B7280' }
      },
      tooltip: { theme: 'light', shared: true, intersect: false },
      noData: {
        text: 'No data available yet',
        align: 'center',
        verticalAlign: 'middle',
        style: { color: '#9CA3AF', fontSize: '14px' }
      }
    };

    this.chart?.destroy();
    this.chart = null;

    if (this.chartElement?.nativeElement) {
      this.chartElement.nativeElement.innerHTML = '';
      this.chart = new ApexCharts(this.chartElement.nativeElement, options);
      this.chart.render();
    }
  }

  getFirstLabel(): string {
    const s = this.stats();
    return s?.monthlyRevenue?.[0]?.label ?? '-';
  }

  getLastLabel(): string {
    const s = this.stats();
    const rev = s?.monthlyRevenue;
    return rev && rev.length > 0 ? (rev[rev.length - 1]?.label ?? '-') : '-';
  }

  hasEnoughMonths(): boolean {
    const s = this.stats();
    return (s?.monthlyRevenue?.length ?? 0) >= 2;
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
